from flask import Flask, request, jsonify
from flask_cors import CORS
from menstural_health_q_a import retrieve_and_answer  # Import your RAG function
import pandas as pd 

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# Handle preflight requests
@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        return jsonify({"message": "Preflight OK"}), 200

@app.route('/ask', methods=['POST'])
def ask():
    try:
        data = request.get_json()
        question = data.get("question")

        if not question:
            return jsonify({"error": "No question provided"}), 400

        # Call the RAG pipeline for the answer
        response = retrieve_and_answer(question)

        return jsonify({"answer": response}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Run Flask server locally
if __name__ == "__main__":
    app.run(port=5000, host="0.0.0.0", debug=True)
