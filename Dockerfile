FROM node:boron

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN npm install -g nodemon
RUN npm install -g sequelize-cli
RUN npm install

EXPOSE 3001
CMD [ "nodemon", "index" ]
