var _ = require('lodash');
var mysql = require('mysql');
var Sequelize = require('sequelize');
var env = require('../env');

function authenticate(next) {
  console.log('connecting', env.mysql.host, env.mysql.port);

  var sequelize = new Sequelize(
    env.mysql.database,
    env.mysql.username,
    env.mysql.password,
    {
      dialect: 'mysql',
      host: env.mysql.host,
      port: env.mysql.port,
      logging: function(str) {
        //console.log(str);
      }
    }
  );
  sequelize.authenticate().then(
    function(result) {
      const models = {};

      models.town = require("./models2/town")(sequelize);
      models.department = require("./models2/department")(sequelize);
      models.region = require("./models2/region")(sequelize);
      models.agency = require("./models2/agency")(sequelize);
      models.listingImage = require("./models2/listing-image")(sequelize);
      models.listingDetail = require("./models2/listing-detail")(sequelize);
      models.listing = require("./models2/listing")(sequelize);

      _.forOwn(models, function(model, ndx) {
        if (model.initialize) {
          model.initialize();
        }
      });

      next(models);
    },
    function(err) {
      console.error(err);
      console.log("trying again in 5 seconds");
      setTimeout(function() {
        authenticate(next);
      }, 5000);
    }
  );
};


module.exports = function (next) {
  authenticate(next);
};
