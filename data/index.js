var mysql = require('mysql'),
    dataModels = {},
    Sequelize = require('sequelize');


exports.register = function (server, options, next) {
    sequelize = new Sequelize('immodispo','immodispo','devpassword', {
        dialect: 'mysql',
        host: '127.0.0.1',
        port: 3306,
        logging: function(str) {

        }
    });

    sequelize.authenticate().complete(function(err) {
       if (err) {
           throw new Error(err);
       } else {

           dataModels.region = require("./models/Region")(sequelize);
           dataModels.department = require("./models/Department")(sequelize);
           dataModels.town = require("./models/Town")(sequelize);
           dataModels.agency = require("./models/Agency")(sequelize);
           dataModels.listingImage = require("./models/ListingImage")(sequelize);
           dataModels.listingDetail = require("./models/ListingDetail")(sequelize);
           dataModels.listing = require("./models/Listing")(sequelize);

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