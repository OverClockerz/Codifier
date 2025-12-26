import os
import json
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
def get_gemini_response(prompt, model=GEMINI_MODEL, response_schema=None, json_mode=False):
    try:
        mime_type = "application/json" if (response_schema or json_mode) else "text/plain"
        
        config = types.GenerateContentConfig(
            temperature=0.3, # Strict
            top_p=0.95,
            top_k=40,
            response_mime_type=mime_type,
            response_schema=response_schema
        )
        
        response = client.models.generate_content(
            model=model,
            contents=prompt,
            config=config
        )
        
        result = response.text
        if mime_type == "application/json":
            try:
                clean_result = result.replace('```json', '').replace('```', '').strip()
                return json.loads(clean_result)
            except json.JSONDecodeError:
                return {}
        
        return result
    except Exception as e:
        print(f"Gemini API Error: {e}")
        raise e

def generate_and_save_problem(difficulty="Medium", topic="Algorithms"):
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
        "difficulty": "{difficulty}",
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
