FROM node:18.18-alpine

WORKDIR /online_tutors_db

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY . .

CMD ["npm", "start"]
