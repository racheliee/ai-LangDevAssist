from flask import Flask, request, jsonify
import modules.feedback_generator as feedback_generator
import modules.problem_generator as problem_generator
import uuid
import os
import base64
from io import BytesIO
from dotenv import load_dotenv
import logging

logging.basicConfig(filename = "logs/project.log", level = logging.DEBUG)

app = Flask(__name__)

load_dotenv()
rag_path =os.path.join(os.path.dirname(__file__), str(os.environ.get('CHAIN_PDF_PATH').strip("'")))
rag_chain = feedback_generator.create_rag_chain(rag_path)

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
    
    logging.debug(f"Request Data: {data}")
    logging.debug(f"User Info: {userInfo}")
    logging.debug(f"Problem ID: {problemId}")
    
    
    whole_text, _question, answer = problem_generator.generate_language_diagnosis_question(userInfo)
    img = problem_generator.generate_image_from_description(_question)
    img_path = os.path.join(os.path.dirname(__file__), "modules", "static", "images", f"{problemId}.png")
    img.save(img_path)
    # 이미지를 메모리 버퍼에 저장
    img_io = BytesIO()
    img.save(img_io, 'PNG')
    img_io.seek(0)  # 버퍼 포인터를 처음으로 되돌림

    # 이미지를 base64로 인코딩
    img_base64 = base64.b64encode(img_io.getvalue()).decode('utf-8')
    question = problem_generator.extract_question_with_choices(whole_text)
    problem = {
        "id": problemId,
        "question": question,
        "answer": answer,
        "image": img_base64,
        "image_path": img_path,
        "whole_text": whole_text
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
    
    audio_path = os.path.join(os.path.dirname(__file__), "modules", "static", "audio", f"{problemId}.m4a")
    file.save(audio_path)
    
    sentence, feedback = feedback_generator.analyze_audio_and_provide_feedback(audio_path)
    rag_feedback = feedback_generator.provide_rag_feedback(rag_chain, feedback)
    
    is_correct = feedback_generator.is_similar(answer, sentence)
    
    return jsonify({
        "statusCode": 200,
        "data": {
            "saved_path": audio_path,
            "feedback": rag_feedback,
            "is_correct": is_correct
        }
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)