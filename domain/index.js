var mysql = require('mysql'),
    domainModels = {};

exports.register = function (server, options, next) {

    var connection = mysql.createConnection({
        host: '127.0.0.1',
        user: 'immodispo',
        password: 'devpassword',
        database: 'immodispo'
    });

    connection.connect(function(err) {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return;
        }

        console.log('connected as id ' + connection.threadId);


        domainModels.region = require("./models/Region")(connection);
        domainModels.department = require("./models/Department")(connection);
        domainModels.town = require("./models/Town")(connection);
        domainModels.agency = require("./models/Agency")(connection);
        domainModels.listing = require("./models/Listing")(connection);
        domainModels.listingImage = require("./models/ListingImage")(connection);

        next();
    });

    server.decorate('reply', 'models', function() {

        return domainModels;
    });
};

exports.register.attributes = {
    name: 'database',
    version: '1.0.0'
};