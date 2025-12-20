
import json
from urllib import response
from google import genai

def generate_response(data={
    "question":"put the question here",
    "difficulty":"hard",
    "topic":"data structures",
    "language":"python",
    "type":"MCQ",
    "options":['put the options in this list as different elements'],
    "correct option":"put the correct option here as an index of the list",
    }):
    
    data_json=json.dumps(data)

    # The client gets the API key from the environment variable `GEMINI_API_KEY`.
    client = genai.Client()

    response = client.models.generate_content(
    model="gemini-2.5-flash", contents=f"{data_json} Generate a question based on the above data and return it in the same JSON format without giving ```json ``` tags"
    )
    return response.text