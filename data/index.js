var _ = require('lodash'),
    env = require('../env'),
    mysql = require('mysql'),
    dataModels = {},
    Sequelize = require('sequelize');


exports.register = function (server, options, next) {
    sequelize = new Sequelize(
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

    sequelize.authenticate().complete(function(err) {
       if (err) {
           throw new Error(err);
       } else {

           dataModels.town = require("./models/Town")(sequelize);
           dataModels.department = require("./models/Department")(sequelize);
           dataModels.region = require("./models/Region")(sequelize);
           dataModels.agency = require("./models/Agency")(sequelize);
           dataModels.listingImage = require("./models/ListingImage")(sequelize);
           dataModels.listingDetail = require("./models/ListingDetail")(sequelize);
           dataModels.listing = require("./models/Listing")(sequelize);

           _.forOwn(dataModels, function(model, ndx) {
               if (model.initialize) {
                   model.initialize();
               }
           });

           next();
       }
    });

    server.decorate('server', 'data', function() {

        return dataModels;
    });

};

exports.register.attributes = {
    name: 'datamodel',
    version: '1.0.0'
};