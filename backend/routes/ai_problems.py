from flask import Blueprint, request, jsonify
from datetime import datetime
from extensions import mongo as db
from utils.ai_helpers import GEMINI_MODEL, generate_and_save_problem, get_gemini_response
import json
import traceback

ai_problems_bp = Blueprint("ai_problems", __name__)

@ai_problems_bp.route("/api/problem", methods=["GET"])
def get_current_problem():
    try:
        # Prefer problems attached to a player's activeQuests
        username = request.args.get('username')
        if db is not None and username:
            player = db.db.players.find_one({'username': username}, {'_id': 0, 'activeQuests': 1})
            if player and player.get('activeQuests'):
                for quest in player.get('activeQuests', []):
                    if quest.get('zone') == 'workspace' and quest.get('type') == 'Coding':
                        # The quest itself contains the full problem definition
                        return jsonify(quest)
            return jsonify({'error': 'No active coding quest found for user.'}), 404

        # Backwards-compatible fallback for callers that don't provide a username
        if db is not None:
            existing_problem = db.db.problems.find_one({}, {'_id': 0})
            if existing_problem:
                return jsonify(existing_problem)
        new_problem = generate_and_save_problem()
        return jsonify(new_problem)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@ai_problems_bp.route("/api/evaluate", methods=["POST"])
def evaluate_solution():
    try:
        data = request.json
        problem = data.get('problem')
        user_code = data.get('userCode')
        language = data.get('language')
        is_submission = data.get('isSubmission', False)

        if not problem or not user_code:
            return jsonify({"error": "Missing problem or code"}), 400

        # 1. Combine all test cases
        all_test_cases = problem.get('examples', []) + problem.get('testCases', [])
        test_cases_str = json.dumps(all_test_cases, indent=2)
        
        boilerplate = problem.get('boilerplates', {}).get(language, '')

        prompt = f"""
        Act as a strict code execution engine. You must simulate the execution of the user's code.

        Problem Title: {problem.get('title')}
        Language: {language}

        Boilerplate Code (for reference):
        ```
        {boilerplate}
        ```

        User Code:
        ```
        {user_code}
        ```

        Test Cases:
        {test_cases_str}

        CRITICAL INSTRUCTIONS:
        1. Compare User Code with Boilerplate Code. If they are effectively identical (user has not implemented logic), mark ALL test cases as failed immediately.
        2. Do NOT assume the code works. Mentally trace the execution with the provided inputs.
        3. If the code has syntax errors, return "passed": false and the error message.
        4. Check strict equality between your calculated output and expectedOutput.

        Return JSON matching:
        {{
            "results": [
                {{
                    "passed": boolean,
                    "actualOutput": "string (what the code actually produces)",
                    "error": "string (or null)"
                }}
            ],
            "feedback": "string",
            "runtime": "string",
            "memory": "string"
        }}
        """
        
        # Use smarter model for evaluation
        evaluation_raw = get_gemini_response(prompt, model=GEMINI_MODEL, json_mode=True)
        results_from_ai = evaluation_raw.get("results", [])
        
        # 2. MERGE AI RESULTS WITH ORIGINAL TEST CASE DATA
        # This ensures inputs/expected outputs are correct and isHidden flag is preserved
        final_results = []
        for i, test_case in enumerate(all_test_cases):
            # Default result if AI returns fewer items than expected
            res = {
                "passed": False,
                "actualOutput": "Error during execution simulation",
                "error": "Timeout or execution failed"
            }
            
            if i < len(results_from_ai):
                res = results_from_ai[i]
            
            # Force original data into the result
            res["input"] = test_case.get("input", "")
            res["expectedOutput"] = test_case.get("expectedOutput", "")
            res["isHidden"] = test_case.get("isHidden", False)
            
            final_results.append(res)
        
        passed_count = sum(1 for res in final_results if res.get("passed"))
        passed_all = (passed_count == len(final_results)) and (len(final_results) > 0)
        
        response_payload = {
            "passedAll": passed_all,
            "score": passed_count,
            "totalTests": len(final_results),
            "results": final_results,
            "feedback": evaluation_raw.get("feedback", "No feedback."),
            "runtime": evaluation_raw.get("runtime", "N/A"),
            "memory": evaluation_raw.get("memory", "N/A")
        }

        if is_submission and db is not None:
            submission = {
                "problem_id": problem.get("id"),
                "problem_title": problem.get("title"),
                "language": language,
                "code": user_code,
                "passed_all": passed_all,
                "score": passed_count,
                "timestamp": datetime.utcnow()
            }
            db.db.submissions.insert_one(submission)

        return jsonify(response_payload)

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
