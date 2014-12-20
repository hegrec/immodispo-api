var Base = require('./Base'),
    _ = require('lodash');

function Department(server) {
    var department = {};
    department.__proto__ = new Base(server);

    
    department.name = null;
    department.code = 0;
    department.capital = null;
    department.kml = null;
    department.latitude = 0;
    department.longitude = 0;

    department.mapDataToDomain = function mapDepartmentDataModel(departmentDataModel) {
        var domainDepartment = Department(server);
        domainDepartment.id = departmentDataModel.id;
        domainDepartment.createdAt = departmentDataModel.createdAt;
        domainDepartment.updatedAt = departmentDataModel.updatedAt;
        domainDepartment.name = departmentDataModel.name;
        domainDepartment.code = departmentDataModel.code;
        domainDepartment.capital = departmentDataModel.capital;
        domainDepartment.kml = departmentDataModel.kml;
        domainDepartment.latitude = departmentDataModel.latitude;
        domainDepartment.longitude = departmentDataModel.longitude;

        return domainDepartment;
    };

    department.find = function departmentFind(params, cb) {

        if (_.isUndefined(cb)) {
            cb = params;
            params = {};
        }

        server.data().department.find(params, function(err, departmentDataModels) {
            var models = [];

            if (err) {
                return cb(err);
            }

            _.each(departmentDataModels, function(dataModel) {
                models.push(department.mapDataToDomain(dataModel));
            });
            cb(null, models);
        });
    };

    department.setName = function setName(name) {
        this.name = name;
    };

    department.getName = function getName() {
        return this.name;
    };

    department.setCode = function setCode(code) {
        this.code = code;
    };

    department.getCode = function getCode() {
        return this.code;
    };

    department.setCapital = function setCapital(capital) {
        this.capital = capital;
    };

    department.getCapital = function getCapital() {
        return this.capital;
    };

    department.setKML = function setKML(kml) {
        this.kml = kml;
    };

    department.getKML = function getKML() {
        return this.kml;
    };

    department.clearKML = function clearKML() {
        delete this.kml;
    };

    department.setLatitude = function setLatitude(lat) {
        this.latitude = lat;
    };

    department.getLatitude = function getLatitude() {
        return this.latitude;
    };

    department.setLongitude = function setLongitude(lng) {
        this.longitude = lng;
    };

    department.getLongitude = function getLongitude() {
        return this.longitude;
    };


    return department;
}

module.exports = Department;