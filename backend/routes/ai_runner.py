from flask import Blueprint, request, jsonify
from utils.ai_helpers import get_gemini_response

ai_runner_bp = Blueprint("ai_runner", __name__, url_prefix="/api")

@ai_runner_bp.route("/run-custom", methods=["POST"])
def run_custom():
    data = request.json

    prompt = f"""
    Act as a compiler.
    Language: {data['language']}
    Code:
    ```
    {data['userCode']}
    ```
    Input: {data.get('customInput')}
    Return JSON {{ "output": "", "error": "" }}
    """

    result = get_gemini_response(prompt, json_mode=True)
    return jsonify(result)
