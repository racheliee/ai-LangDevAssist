from flask import Flask, request, jsonify
import modules.feedback_generator as feedback_generator
import uuid
import os
import base64
from io import BytesIO

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
    
    problemId = str(uuid.uuid4())
    
    userInfo = data.get('userInfo')
    whole_text, question, answer = feedback_generator.generate_language_diagnosis_question(userInfo)
    img = feedback_generator.generate_image_from_description(question)
    img_path = os.path.join(os.path.dirname(__file__), "modules", "static", "images", f"{problemId}.png")
    img.save(img_path)
    # 이미지를 메모리 버퍼에 저장
    img_io = BytesIO()
    img.save(img_io, 'PNG')
    img_io.seek(0)  # 버퍼 포인터를 처음으로 되돌림

    # 이미지를 base64로 인코딩
    img_base64 = base64.b64encode(img_io.getvalue()).decode('utf-8')

    problem = {
        "id": problemId,
        "whole_text": whole_text,
        "answer": answer,
        "question": question,
        "image": img_base64,
        "image_path": img_path
    }
    
    return jsonify({
        "statusCode": 200,
        "data": problem
    })

@app.route('/generate_feedback', methods=['POST'])
def generate_feedback():
    print(request.files)

    file = request.files['voice']
    form = request.form
    problemId = form.get('problemId')
    answer = form.get('answer')
    
    print(file, problemId, answer)
    audio_path = os.path.join(os.path.dirname(__file__), "modules", "static", "audio", f"{problemId}.m4a")
    print('audio_path:', audio_path)
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