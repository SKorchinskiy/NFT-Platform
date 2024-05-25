FROM node:20.11.0

RUN mkdir /app
COPY package.json /app/
WORKDIR /app
COPY . ./

RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
