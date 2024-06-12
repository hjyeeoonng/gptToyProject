# app.py
from gpt import get_gpt_answer
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/process_moves', methods=['POST'])
def process_moves():
    moves = request.json.get('moves')

    result = get_gpt_answer(moves)
    return jsonify(response_move=result)

if __name__ == '__main__':
    app.run(debug=True)