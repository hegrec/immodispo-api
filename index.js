const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const morgan = require('morgan');
const path = require('path');
const env = require('./env');
const agency = require('./routes/agency');
const department = require('./routes/department');
const listing = require('./routes/listing');
const region = require('./routes/region');
const town = require('./routes/town');
const native = require('./routes/native');
const databaseModels = require('./data');

if (!process.env.MASTER_API_KEY) {
  console.error('MASTER_API_KEY was not set, exiting...');
  process.exit(1);
}

const app = express();
const v1Router = express.Router();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.raw({limit: '5mb'}));
app.use(expressValidator());
app.use(morgan('tiny'));

app.disable('x-powered-by');

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/listingImages/:fileName', (req, res) => {
  const fileName = req.params.fileName;

  res.sendFile(path.join(__dirname, `content/${fileName}`));
});

v1Router.get('/', (req, res) => {
  res.send({
    time: new Date()
  });
});

v1Router.use((req, res, next) => {
  console.log('boom!');
  console.log(req.headers, process.env.MASTER_API_KEY);
  if (req.headers.master_api_key !== process.env.MASTER_API_KEY) {
    return res.status(401).send('I\'ve got the same combination on my luggage!');
  }

  next();
});

app.use('/v1', v1Router);


databaseModels((models) => {
  agency(v1Router, models);
  department(v1Router, models);
  listing(v1Router, models);
  native(v1Router, models);
  region(v1Router, models);
  town(v1Router, models);

  app.listen(env.port);
});
