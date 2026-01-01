import os
import json
import random
import re
from dotenv import load_dotenv
from google import genai
from google.genai import types
from tenacity import retry, stop_after_attempt, wait_exponential
from extensions import mongo as db

load_dotenv()

API_KEY = os.getenv("GOOGLE_API_KEY")
GEMINI_MODEL = "gemini-2.5-flash"

client = genai.Client(api_key=API_KEY)

@retry(stop=stop_after_attempt(3), wait=wait_exponential(min=2, max=10))
def get_gemini_response(prompt, model=GEMINI_MODEL, schema=None):
    try:
        if schema:
            response = client.models.generate_content(
                model=model,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=schema,
                    temperature=0.3
                )
            )
            return response.parsed  # ✅ dict or list

        else:
            response = client.models.generate_content(
                model=model,
                contents=prompt
            )
            return response.text  # ✅ plain text

    except Exception as e:
        print(f"Gemini API Error: {e}")
        return None

def generate_and_save_problem(difficulty="4", topic="Algorithms"):
    prompt = f"""
    Generate a unique coding problem for a coding interview platform.
    Difficulty: {difficulty}
    Topic: {topic}
    
    Return a JSON object with this exact schema:
    {{
        "id": "string (kebab-case-unique-id)",
        "title": "string",
        "description": "string (markdown allowed)",
        "constraints": ["string"],
        "difficulty": "{difficulty} on a scale of 1-4",
        "topics": ["string"],
        "boilerplates": {{
            "python": "def solution(arg1):\\n    pass",
            "java": "class Solution {{\\n    public int solution(int arg1) {{\\n        return 0;\\n    }}\\n}}"
        }},
        "examples": [
            {{ "input": "string", "expectedOutput": "string", "isHidden": false }}
        ],
        "testCases": [
            {{ "input": "string", "expectedOutput": "string", "isHidden": true }}
        ]
    }}
    Ensure at least 2 public examples and 3 hidden test cases.
    """
    problem_data = get_gemini_response(prompt, model=GEMINI_MODEL, json_mode=True)

    print(f"prompt: {prompt} , problem_data: {problem_data}")

    if db.db is not None:
        try:
            db.db.problems.delete_many({})
            if "id" in problem_data:
                db.db.problems.insert_one(problem_data)
        except Exception as e:
            print(f"DB Error: {e}")
            
    return problem_data

def generate_response(data=None, num=1):
    """
    Interact with Google Gemini using Structured Output (JSON Schemas).
    Handles both 'Generation' (Questions) and 'Evaluation' (Grading).
    """
    if data is None: data = {}
    
    # Use a stable model. Switch to 'gemini-2.0-flash-exp' if you have access.
    model_name ="gemini-2.5-flash"
    
    # --- 1. DETERMINE MODE & DEFINE SCHEMA ---
    
    # CASE A: EVALUATION MODE (Grading an answer)
    if "custom_prompt" in data:
        prompt = data["custom_prompt"]
        
        # Define strict schema for grading
        schema = {
            "type": "object",
            "properties": {
                "score": {"type": "integer"},
                "spellingErrors": {"type": "array", "items": {"type": "string"}},
                "technicalAccuracy": {"type": "string"},
                "improvedAnswer": {"type": "string"},
                "keyConceptsMissed": {"type": "array", "items": {"type": "string"}},
                "isCorrect": {"type": "boolean"},
            },
            "required": ["score", "technicalAccuracy", "improvedAnswer", "isCorrect"]
        }

    # CASE B: GENERATION MODE (Creating questions)
    else:
        topic = data.get("topic", "Software Engineering")
        
        # Add randomness to prompt to prevent repetitive questions
        styles = ["conceptual", "debugging", "system design", "best practices"]
        chosen_style = random.choice(styles)
        seed = random.randint(1, 100000)
        
        prompt = (
            f"Generate {num} unique technical interview question(s) about {topic}. "
            f"Focus on a {chosen_style} aspect. Random Seed: {seed}"
        )
        
        # Define strict schema for a LIST of questions
        schema = {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "text": {"type": "string"},
                    "difficulty": {"type": "string", "enum": ["Beginner", "Intermediate", "Advanced"]},
                    "topic": {"type": "string"},
                },
                "required": ["text", "difficulty", "topic"]
            }
        }

    # --- 2. CALL GEMINI API ---
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=schema,
                temperature=0.3
            )
        )
        
        result_text = response.text
        parsed_json = response.parsed
        print(parsed_json)

        # --- 3. FORMATTING FIX FOR APP.PY ---
        # app.py expects a list (it calls result[0]). 
        # Evaluation mode returns a dict. We must wrap it.
        if isinstance(parsed_json, dict):
            return json.dumps([parsed_json])
            
        # Generation mode is already a list.
        return result_text

    except Exception as e:
        print(f"❌ Gemini API Error: {e}")
        # Return an empty list string so app.py doesn't crash on json.loads()
        return "[]"
