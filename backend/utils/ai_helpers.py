import os
import json
from dotenv import load_dotenv
from google import genai
from google.genai import types
from tenacity import retry, stop_after_attempt, wait_exponential

load_dotenv()

API_KEY = os.getenv("GOOGLE_API_KEY")
GEMINI_MODEL = "gemini-2.5-flash"

client = genai.Client(api_key=API_KEY)

@retry(stop=stop_after_attempt(3), wait=wait_exponential(min=2, max=10))
def get_gemini_response(prompt, response_schema=None, json_mode=False):
    mime_type = "application/json" if (response_schema or json_mode) else "text/plain"

    config = types.GenerateContentConfig(
        temperature=0.3,
        response_mime_type=mime_type,
        response_schema=response_schema
    )

    response = client.models.generate_content(
        model=GEMINI_MODEL,
        contents=prompt,
        config=config
    )

    if mime_type == "application/json":
        clean = response.text.replace("```json", "").replace("```", "").strip()
        return json.loads(clean)

    return response.text
