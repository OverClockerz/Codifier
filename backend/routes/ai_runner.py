from flask import Blueprint, request, jsonify
from utils.ai_helpers import GEMINI_MODEL, generate_and_save_problem, get_gemini_response
from utils.auth_helper import require_auth
ai_runner_bp = Blueprint("ai_runner", __name__)

@ai_runner_bp.route("/api/run-custom", methods=["POST"])
@require_auth
def run_custom():
    try:
        data = request.json
        user_code = data.get('userCode')
        language = data.get('language')
        custom_input = data.get('customInput')

        prompt = f"""
        Act as a code compiler.
        Also check that language syntax is correct before running and that the language matches the code provided.
        Language: {language}
        Code:
        ```
        {user_code}
        ```
        Input: {custom_input}
        Return JSON: {{ "output": "stdout", "error": "stderr" }}
        """
        result = get_gemini_response(prompt, model=GEMINI_MODEL, json_mode=True)
        return jsonify(result)
    except Exception as e:
        return jsonify({"output": "", "error": str(e)}), 500


@ai_runner_bp.route('/api/generate-problem', methods=["POST"])
@require_auth
def generate_problem():
    try:
        data = request.json or {}
        difficulty = data.get('difficulty', 'Medium')
        topic = data.get('topic', 'Algorithms')

        problem_data = generate_and_save_problem(difficulty, topic)
        return jsonify(problem_data)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@ai_runner_bp.route('/api/hint', methods=["POST"])
@require_auth
def get_hint():
    try:
        data = request.json
        problem = data.get('problem')
        user_code = data.get('userCode')
        query = data.get('query')

        prompt = f"""
        You are a coding tutor.
        Problem: {problem.get('title')}
        User Code: {user_code}
        Question: {query}
        Provide a concise hint.
        """
        response_text = get_gemini_response(prompt, model=GEMINI_MODEL)
        return jsonify({"text": response_text})
    except Exception as e:
        return jsonify({"text": "Error generating hint."}), 500