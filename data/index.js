var _ = require('lodash'),
    env = require('../env'),
    mysql = require('mysql'),
    internals = {},
    dataModels = {},
    Sequelize = require('sequelize');

internals.authenticate = function(next) {
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
        },
        function(err) {
            console.error(err);
            console.log("trying again in 5 seconds");
            setTimeout(function() {
                internals.authenticate(next);
            }, 5000);
        }
    );
};


exports.register = function (server, options, next) {
    internals.authenticate(next);

    server.decorate('server', 'data', function() {

        return dataModels;
    });

};



exports.register.attributes = {
    name: 'datamodel',
    version: '1.0.0'
};
