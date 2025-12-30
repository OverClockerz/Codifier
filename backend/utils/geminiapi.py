import json
import os
from google import genai
import re
def generate_response(data={
    "question":"put the question here",
    "difficulty":"hard",
    "topic":"data structures",
    "language":"python",
    "type":"MCQ",
    "options":['put the options in this list as different elements'],
    "correct option":"put the correct option here as an index of the list",
    }, num=1):
    
    data_json=json.dumps(data)

    # The client gets the API key from the environment variable `GEMINI_API_KEY`.
    KEY=os.getenv("GEMINI_API_KEY")
    print(KEY)
    client = genai.Client(api_key=KEY)

    response = client.models.generate_content(
    model="gemini-2.5-flash", contents=f"[{data_json}] Generate a list of {num} questions based on the above data and return it in the same list of JSON format without giving ```json ``` tags"
    )

    match = re.search(r"\[(.*)\]", response.text, re.DOTALL)

    if match:
       json_str = match.group(1).strip()
       json_str = f"[{json_str}]"
       print("Extracted JSON string:", json_str)
       return json_str
    

    return response.text