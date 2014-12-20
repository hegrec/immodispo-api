var Base = require('./Base'),
    _ = require('lodash');

function Town(server) {
    var town = {};
    town.__proto__ = new Base(server);

    town.name = null;
    town.code = 0;
    town.kml = null;
    town.surfaceArea = 0;
    town.population = 0;
    town.latitude = 0;
    town.longitude = 0;

    town.mapDataToDomain = function mapTownDataModel(townDataModel) {
        var domainTown = Town(server);

        domainTown.id = townDataModel.id;
        domainTown.createdAt = townDataModel.createdAt;
        domainTown.updatedAt = townDataModel.updatedAt;
        domainTown.name = townDataModel.name;
        domainTown.code = townDataModel.code;
        domainTown.surfaceArea = townDataModel.surface_area;
        domainTown.population = townDataModel.population;
        domainTown.kml = townDataModel.kml;
        domainTown.latitude = townDataModel.latitude;
        domainTown.longitude = townDataModel.longitude;

        return domainTown;
    };

    town.find = function townFind(params, cb) {

        if (_.isUndefined(cb)) {
            cb = params;
            params = {};
        }

        server.data().town.find(params, function(err, townDataModels) {
            var models = [];

            if (err) {
                return cb(err);
            }

            _.each(townDataModels, function(dataModel) {
                models.push(town.mapDataToDomain(dataModel));
            });

            cb(null, models);
        });
    };

    town.setName = function setName(name) {
        this.name = name;
    };

    town.getName = function getName() {
        return this.name;
    };

    town.setCode = function setCode(code) {
        this.code = code;
    };

    town.getCode = function getCode() {
        return this.code;
    };

    town.setCapital = function setCapital(capital) {
        this.capital = capital;
    };

    town.getCapital = function getCapital() {
        return this.capital;
    };

    town.setKML = function setKML(kml) {
        this.kml = kml;
    };

    town.getKML = function getKML() {
        return this.kml;
    };

    town.setSurfaceArea = function setSurfaceArea(surfaceArea) {
        this.surfaceArea = surfaceArea;
    };

    town.getSurfaceArea = function getSurfaceArea() {
        return this.surfaceArea;
    };

    town.setPopulation = function setPopulation(population) {
        this.population = population;
    };

    town.getPopulation = function getPopulation() {
        return this.population;
    };

    town.setLatitude = function setLatitude(lat) {
        this.latitude = lat;
    };

    town.getLatitude = function getLatitude() {
        return this.latitude;
    };

    town.setLongitude = function setLongitude(lng) {
        this.longitude = lng;
    };

    town.getLongitude = function getLongitude() {
        return this.longitude;
    };

    town.clearKML = function clearKML() {
        delete this.kml;
    };

    return town;
}

module.exports = Town;