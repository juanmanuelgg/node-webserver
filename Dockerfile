FROM node:18

WORKDIR /usr/src/app

# Both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm ci --omit=dev

# Bundle app source
COPY server ./

EXPOSE 8080
CMD [ "node", "server/main.mjs" ]