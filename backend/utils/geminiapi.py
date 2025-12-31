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

    prompt = (
    "Generate a list of questions based on the above data and return it in the same list of JSON format without giving ```json ``` tags 60% quests will be mcq 30% will be comprehensive and 10% will be coding/typing"
    if zone in ("workspace", "meeting-room")
    else "Generate a list of questions based on the above data and return it in the same list of JSON format without giving ```json ``` tags 60% quests will be mcq 40% will be comprehensive"
   )


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