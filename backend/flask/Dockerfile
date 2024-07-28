FROM python:3.9-slim

COPY . /app

RUN pip3 install flask	
RUN pip3 install -r /app/requirements.txt

WORKDIR /app

EXPOSE 8080

CMD [ "python3", "-m", "flask", "run", "--host=0.0.0.0", "--port=8080" ]