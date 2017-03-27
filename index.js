const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const morgan = require('morgan');
const env = require('./env');
const agency = require('./routes/agency');
const department = require('./routes/department');
const listing = require('./routes/listing');
const region = require('./routes/region');
const town = require('./routes/town');
const native = require('./routes/native');
const databaseModels = require('./data');

const app = express();
const v1Router = express.Router();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.raw({limit: '5mb'}));
app.use(expressValidator());
app.use(morgan('tiny'));

app.get('/', (req, res) => {
  res.send('Hello World');
});

v1Router.get('/', (req, res) => {
  res.send({
    time: new Date()
  });
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
