FROM node:boron

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . /usr/src/app

RUN yarn global add node-gyp
RUN npm install -g sequelize-cli
RUN yarn install

EXPOSE 80
CMD [ "node", "index.js" ]
