# use node v20.11.0 image as basic
FROM node:20.11.0

# navigate to working directory
WORKDIR /usr/src/nextjs-frontend

# copy package-*.json files as part of layer caching strategy
COPY package.json package-lock.json ./

# install packages whenever package-*.json files change
RUN npm install
# build project
RUN npm run build

# copy all files from current directory to the image
COPY . .

EXPOSE 3000

# run frontend code inside container
CMD ["npm", "start"]
