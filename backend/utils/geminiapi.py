# utils/geminiapi.py
import json
import os
import re
from google import genai

def generate_response(data, num=1, zone="workspace"):
    """
    Generate quests using Gemini API based on provided templates.
    """
    # Ensure data is a dict/list before dumping
    if isinstance(data, str):
        data_obj = json.loads(data)
    else:
        data_obj = data

    # Inject zone into each quest template
    for quest in data_obj:
        quest["zone"] = zone

    # Serialize to JSON string
    data_json = json.dumps(data_obj)

    # Get API key
    KEY = os.getenv("GEMINI_API_KEY")
    client = genai.Client(api_key=KEY)

    # Define prompt
   
    if zone == "workspace":
          prompt = f'''
         Generate a list of {num} quests based on the above data.
         Return the output strictly as a JSON array (no ```json fences).
   
         Quest distribution:
         - 40% Multiple Choice Questions (MCQ)
         - 30% Comprehensive / long-form questions
         - 30% Coding or typing tasks
   
         Rules for WORKSPACE zone:
         - Focus on technical and problem-solving skills
         - Include coding challenges, system design, debugging, and analytical tasks
         - Typing tasks may include technical documentation or code transcription
         - Avoid soft-skill–only or communication-focused quests
         '''
   
    elif zone == "meeting-room":
             prompt = f'''
         Generate a list of {num} quests based on the above data.
         Return the output strictly as a JSON array (no ```json fences).
   
         Quest distribution:
         - 40% Multiple Choice Questions (MCQ)
         - 30% Comprehensive / scenario-based questions
         - 30% Typing or communication tasks
   
         Rules for MEETING-ROOM zone:
         - Focus on soft skills, communication, collaboration, and leadership
         - Include typing tasks such as drafting emails, reports, or meeting notes
         - Include situational judgement and behavioral scenarios
         - Avoid coding or low-level technical implementation tasks
         '''
   
    else:
             prompt = f'''
         Generate a list of {num} quests based on the above data.
         Return the output strictly as a JSON array (no ```json fences).
   
         Quest distribution:
         - 60% Multiple Choice Questions (MCQ)
         - 40% Comprehensive questions
   
         Rules:
         - Focus on mathematical aptitude, logical reasoning, and critical thinking
         - Only Multiple choice and comprehensive questions
         '''
        

    # Generate content
    response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents=f"[{data_json}] {prompt}"
    )

    # Extract JSON array from response text
    match = re.search(r"\[(.*)\]", response.text, re.DOTALL)
    if match:
        json_str = match.group(1).strip()
        json_str = f"[{json_str}]"
        return json_str

    return response.text