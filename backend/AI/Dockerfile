FROM python:3.12-slim

COPY . /app
RUN apt-get update && apt-get install -y \
    build-essential \
    wget \
    && apt-get clean

RUN pip3 install --upgrade pip
RUN pip3 install flask	
RUN pip3 install --no-cache-dir -r /app/requirements.txt

WORKDIR /app

EXPOSE 8080

CMD [ "python3", "-m", "flask", "run", "--host=0.0.0.0", "--port=8080" ]