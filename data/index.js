var mysql = require('mysql'),
    dataModels = {};

exports.register = function (server, options, next) {

    var connectionPool = mysql.createPool({
        connectionLimit: 100,
        host: '127.0.0.1',
        user: 'immodispo',
        password: 'devpassword',
        database: 'immodispo'
    });

    dataModels.region = require("./models/Region")(connectionPool);
    dataModels.department = require("./models/Department")(connectionPool);
    dataModels.town = require("./models/Town")(connectionPool);
    dataModels.agency = require("./models/Agency")(connectionPool);
    dataModels.listing = require("./models/Listing")(connectionPool);
    dataModels.listingImage = require("./models/ListingImage")(connectionPool);

    server.decorate('server', 'data', function() {

        return dataModels;
    });
    next();
};

exports.register.attributes = {
    name: 'datamodel',
    version: '1.0.0'
};