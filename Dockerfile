FROM node:18
WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV APP_ENV=production
ENV APP_PORT=8080
ENV MODEL_URL="https://storage.googleapis.com/model-bucket-submissionmlgc/model-project/model.json"
ENV PROJECT_ID="submissionmlgc-fatah"

CMD [ "npm", "start" ]

EXPOSE 8080