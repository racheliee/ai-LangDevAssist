FROM python:3.9-slim

COPY . /app

RUN pip3 install flask	
RUN pip3 install -r /app/requirements.txt

WORKDIR /app

CMD [ "python3", "-m", "flask", "run"]
