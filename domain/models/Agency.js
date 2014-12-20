var Base = require('./Base'),
    Town = require('./Town'),
    _ = require('lodash');

function Agency(server) {
    var agency = {};
    agency.__proto__ = new Base(server);

    agency.name = null;
    agency.image = null;
    agency.address_1 = null;
    agency.address_2 = null;
    agency.telephone = null;
    agency.email = null;
    agency.website = null;
    agency.town = null;

    agency.mapDataToDomain = function mapAgencyDataModel(agencyDataModel) {
        var domainAgency = Agency(server);

        domainAgency.id = agencyDataModel.id;
        domainAgency.createdAt = agencyDataModel.createdAt;
        domainAgency.updatedAt = agencyDataModel.updatedAt;

        domainAgency.name = agencyDataModel.name;
        domainAgency.image = "/agencyImages/" + agencyDataModel.image;
        domainAgency.address_1 = agencyDataModel.address_1;
        domainAgency.address_2 = agencyDataModel.address_2;
        domainAgency.telephone = agencyDataModel.telephone;
        domainAgency.email = agencyDataModel.email;
        domainAgency.website = agencyDataModel.website;
        //TODO: domainAgency.town = new Town(server).mapDataToDomain(agencyDataModel.town);

        return domainAgency;
    };

    agency.find = function agencyFind(params, cb) {

        if (_.isUndefined(cb)) {
            cb = params;
            params = {};
        }

        server.data().agency.find(params, function(err, agencyDataModels) {
            var models = [];

            if (err) {
                return cb(err);
            }

            _.each(agencyDataModels, function(dataModel) {
                models.push(agency.mapDataToDomain(dataModel));
            });
            cb(null, models);
        });
    };

    return agency;
}

module.exports = Agency;