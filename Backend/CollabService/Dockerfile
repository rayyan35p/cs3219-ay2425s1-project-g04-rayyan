FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3004
EXPOSE 1234

CMD ["npm", "start"]