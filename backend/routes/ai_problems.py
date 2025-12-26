from flask import Blueprint, request, jsonify
from datetime import datetime
from extensions import mongo
from utils.ai_helpers import get_gemini_response
import json
import traceback

ai_problems_bp = Blueprint("ai_problems", __name__, url_prefix="/api")

@ai_problems_bp.route("/problem", methods=["GET"])
def get_problem():
    existing = mongo.db.problems.find_one({}, {"_id": 0})
    if existing:
        return jsonify(existing)

    prompt = """Generate a coding problem ... (same prompt)"""
    problem = get_gemini_response(prompt, json_mode=True)

    mongo.db.problems.delete_many({})
    mongo.db.problems.insert_one(problem)

    return jsonify(problem)


@ai_problems_bp.route("/evaluate", methods=["POST"])
def evaluate():
    try:
        data = request.json
        problem = data["problem"]
        
        test_cases = problem["examples"] + problem["testCases"]

        prompt = f"""Act as a strict execution engine..."""

        evaluation = get_gemini_response(prompt, json_mode=True)

        results = evaluation.get("results", [])
        merged = []

        for i, tc in enumerate(test_cases):
            res = results[i] if i < len(results) else {"passed": False}
            res.update(tc)
            merged.append(res)

        passed = sum(r["passed"] for r in merged)

        return jsonify({
            "passedAll": passed == len(merged),
            "score": passed,
            "totalTests": len(merged),
            "results": merged,
            "feedback": evaluation.get("feedback")
        })

    except Exception:
        traceback.print_exc()
        return jsonify({"error": "Evaluation failed"}), 500
