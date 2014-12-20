var Base = require('./Base'),
    _ = require('lodash');

function Region(server) {
    var region = {};
    region.__proto__ = new Base(server);

    region.name = null;
    region.code = 0;
    region.capital = null;
    region.latitude = 0;
    region.longitude = 0;

    region.mapDataToDomain = function mapRegionDataModel(regionDataModel) {
        var domainRegion = Region(server);
        domainRegion.id = regionDataModel.id;
        domainRegion.createdAt = regionDataModel.createdAt;
        domainRegion.updatedAt = regionDataModel.updatedAt;
        domainRegion.name = regionDataModel.name;
        domainRegion.code = regionDataModel.code;
        domainRegion.capital = regionDataModel.capital;
        domainRegion.latitude = regionDataModel.latitude;
        domainRegion.longitude = regionDataModel.longitude;

        return domainRegion;
    };

    region.find = function regionFind(params, cb) {

        if (_.isUndefined(cb)) {
            cb = params;
            params = {};
        }

        server.data().region.find(params, function(err, regionDataModels) {
            var models = [];

            if (err) {
                return cb(err);
            }

            _.each(regionDataModels, function(dataModel) {
                models.push(region.mapDataToDomain(dataModel));
            });
            cb(null, models);
        });
    };

    region.setName = function setName(name) {
        this.name = name;
    };

    region.getName = function getName() {
        return this.name;
    };

    region.setCode = function setCode(code) {
        this.code = code;
    };

    region.getCode = function getCode() {
        return this.code;
    };

    region.setCapital = function setCapital(capital) {
        this.capital = capital;
    };

    region.getCapital = function getCapital() {
        return this.capital;
    };

    region.setLatitude = function setLatitude(lat) {
        this.latitude = lat;
    };

    region.getLatitude = function getLatitude() {
        return this.latitude;
    };

    region.setLongitude = function setLongitude(lng) {
        this.longitude = lng;
    };

    region.getLongitude = function getLongitude() {
        return this.longitude;
    };

    return region;
}

module.exports = Region;