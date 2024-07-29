from flask import Flask, request, jsonify
import modules.feedback_generator as feedback_generator
import uuid
import os

app = Flask(__name__)

ALLOWED_EXTENSIONS = set(['m4a'])
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS

@app.route('/generate_problem', methods=['POST'])
def generate_problem():
    data = request.get_json()
    
    if data is None:
        return jsonify({
            "statusCode": 400,
            "message": "Invalid request"
        })
    
    problem_content = ""
    problemId = str(uuid.uuid4())
    problem = {
        "id": problemId,
        "content": problem_content
    }
    return jsonify({
        "statusCode": 200,
        "data": problem
    })

@app.route('/generate_feedback', methods=['POST'])
def generate_feedback():
    file = request.files['audio']
    data = request.get_json()
    problemId = data['problemId']
    
    if file.filename == '':
        return jsonify({
            "statusCode": 400,
            "message":'No selected file'
        })
    
    if not file or not allowed_file(file.filename):
        return jsonify({
            "statusCode": 400,
            "message":'Invalid file'
        })
    
    audio_path = os.path.join(os.path.dirname(__file__), "static", f"{problemId}.m4a")
    file.save(audio_path)
    
    feedback = feedback_generator.start_analysis(audio_path)
    
    return jsonify({
        "statusCode": 200,
        "data": {
            "saved_path": audio_path,
            "feedback": feedback
        }
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)