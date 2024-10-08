from flask import Flask, request, jsonify
import modules.feedback_generator as feedback_generator
import modules.problem_generator as problem_generator
import uuid
import os
import base64
from io import BytesIO
from dotenv import load_dotenv
import logging

app = Flask(__name__)

logging.basicConfig(level=logging.DEBUG)

# 콘솔 핸들러 추가
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.DEBUG)

# 포매터 설정
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
console_handler.setFormatter(formatter)

# Flask 애플리케이션 로거에 콘솔 핸들러 추가
app.logger.addHandler(console_handler)

load_dotenv()
rag_path =os.path.join(os.path.dirname(__file__), str(os.environ.get('CHAIN_PDF_PATH').strip("'")))
rag_chain = feedback_generator.create_rag_chain(rag_path)

ALLOWED_EXTENSIONS = set(['m4a'])
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS

@app.route('/chat/generate_problem', methods=['POST'])
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

    # 이미지 경로가 존재하지 않으면 디렉토리 생성
    if not os.path.exists(os.path.dirname(img_path)):
        os.makedirs(os.path.dirname(img_path))

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

@app.route('/chat/generate_feedback', methods=['POST'])
def generate_feedback():
    print(request.files)

    file = request.files['voice']
    form = request.form
    problemId = form.get('problemId')
    answer = form.get('answer')
    
    if file is None or problemId is None or answer is None:
        return jsonify({
            "statusCode": 400,
            "message": "Invalid request"
        })
    
    audio_path = os.path.join(os.path.dirname(__file__), "modules", "static", "audio", f"{problemId}.m4a")
    if not os.path.exists(os.path.dirname(audio_path)):
        os.makedirs(os.path.dirname(audio_path))
    file.save(audio_path)
    
    sentence, feedback = feedback_generator.analyze_audio_and_provide_feedback(audio_path)
    logging.debug(answer)
    if sentence:    
        is_correct = feedback_generator.is_similar(answer, sentence)
    else:
        is_correct = False
        
    ret_feedback = ""
        
    if is_correct:
        ret_feedback = feedback_generator.provide_rag_feedback(rag_chain, feedback)
    elif sentence:

        img_path = os.path.join(os.path.dirname(__file__), "modules", "static", "images", f"{problemId}.png")
        encoded_img = base64.b64encode(open(img_path, "rb").read()).decode('utf-8')
        ret_feedback = feedback_generator.generate_vocab_feedback(encoded_img, answer, sentence)
    else:
        ret_feedback = feedback

    
    
    return jsonify({
        "statusCode": 200,
        "data": {
            "voice_path": audio_path,
            "feedback": ret_feedback,
            "is_correct": is_correct
        }
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)