var mysql = require('mysql'),
    domainModels = {};

exports.register = function (server, options, next) {

    var connectionPool = mysql.createPool({
        connectionLimit: 100,
        host: '127.0.0.1',
        user: 'immodispo',
        password: 'devpassword',
        database: 'immodispo'
    });

    domainModels.region = require("./models/Region")(server);
    domainModels.department = require("./models/Department")(server);
    domainModels.town = require("./models/Town")(server);
    domainModels.agency = require("./models/Agency")(server);
    domainModels.listing = require("./models/Listing")(server);

    server.decorate('reply', 'domain', function() {

        return domainModels;
    });

    next();
};

exports.register.attributes = {
    name: 'domainmodel',
    version: '1.0.0'
};