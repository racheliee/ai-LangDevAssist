from flask import Flask, request

app = Flask(__name__)

@app.route('/')
def hello():
    return 'Hello Flask World'

@app.route('/generate_problem', methods=['POST'])
def generate_problem():
    data = request.get_json()
    
    return 'Problem Generated'

@app.route('/generate_feedback', methods=['POST'])
def generate_feedback():
    data = request.get_json()
    
    return 'Feedback Generated'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)