from flask import Flask, request, jsonify
import numpy as np

app = Flask(__name__)

# dummy model — replace with your trained model
def dummy_predict(arr):
    # simply total the answers and scale to [0,1]
    s = float(np.sum(arr))
    return s / 27.0

@app.route('/predict', methods=['POST'])
def predict():
    body = request.get_json()
    answers = body.get('answers')
    if not answers:
        return jsonify({'error':'missing answers'}), 400
    score = dummy_predict(np.array(answers))
    return jsonify({'risk': float(score)})

if __name__ == '__main__':
    app.run(port=8000)
