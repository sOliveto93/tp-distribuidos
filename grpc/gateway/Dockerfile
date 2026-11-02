FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY src ./src

COPY proto ./proto

EXPOSE 3000

CMD ["npm", "start"]