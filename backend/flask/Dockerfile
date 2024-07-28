FROM python:3.9-slim
COPY . /app
RUN pip3 install flask	
WORKDIR /app/app
CMD [ "python3", "-m", "flask", "run", "--port=8080", "--host=0.0.0.0"]
