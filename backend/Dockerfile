# Base Image
FROM node:20-alpine

ENV DOCKERIZE_VERSION v0.2.0
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

# Set the working directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
COPY prisma/ ./

# Install app dependencies
RUN npm install


# Bundle app source
COPY . .

RUN npm run build

RUN chmod +x docker-entrypoint.sh
ENTRYPOINT [ "sh", "/usr/src/app/docker-entrypoint.sh" ]

# Expose the port the app runs on
EXPOSE 8000



