FROM node:21-alpine

WORKDIR /app

COPY apis-mock.json .
COPY routes.json .
COPY ids-middleware.js .
COPY server.js .

RUN npm init -y && npm install json-server@v0.17.4

EXPOSE 8082

CMD ["node", "server.js"]