import json
from utils.auth_helper import require_auth
from flask import Blueprint, jsonify, request

from utils.ai_helpers import generate_response

ai_comprehensive_bp = Blueprint('ai_comprehensive', __name__)

@ai_comprehensive_bp.route('/api/evaluate_comprehensive', methods=['POST'])
@require_auth
def evaluate_answer():
    data = request.get_json()
    print(data)
    question_obj = data.get('question', {})
    user_answer = data.get('user_answer')

    if not question_obj or not user_answer:
        return jsonify({"error": "Missing data"}), 400

    try:
        eval_prompt = f"""
            You are a technical interviewer.
            Question: "{question_obj.get('question')}"
            Candidate Answer: "{user_answer}"
            
            Evaluate this answer. Return a JSON object with strictly these keys:
            - "score": number (0-100)
            - "isCorrect": boolean
            - "spellingErrors": list of strings (typos)
            - "keyConceptsMissed": list of strings (important missing technical details)
            - "technicalAccuracy": string (brief analytical comment)
            - "improvedAnswer": string (a better, more complete version of the answer)
        """

        input_data = { "custom_prompt": eval_prompt }

        # Call Gemini
        json_string = generate_response(data=input_data, num=1)
        generated_list = json.loads(json_string)
        evaluation_data = generated_list[0] if generated_list else {}

        return jsonify(evaluation_data), 200

    except Exception as e:
        print(f"Evaluate Error: {e}")
        return jsonify({"error": str(e)}), 500
