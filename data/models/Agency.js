var Base = require('./Base');

function Agency(db) {
    var agency = {};
    agency.__proto__ = new Base(db);

    agency.setTableName('Agencies');
    agency.setSchema({
        name: String,
        image: String,
        address_1: String,
        address_2: String,
        telephone: String,
        email: String,
        website: String,
        TownId: Number
    });

    return agency;
}

module.exports = Agency;