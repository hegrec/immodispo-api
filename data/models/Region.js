var Sequelize = require('sequelize'),
    _ = require('lodash'),
    BaseDAO = require('./Base'),
    DomainRegion = require('./../../domain/Region');

function Region(sequelize) {
    var region = {};
    region.__proto__ = new BaseDAO(sequelize);

    var RegionDAO = sequelize.define('Region', {
            name: {
                type: Sequelize.STRING
            },
            code: {
                type: Sequelize.INTEGER
            },
            capital: {
                type: Sequelize.STRING
            },
            latitude: {
                type: Sequelize.FLOAT
            },
            longitude: {
                type: Sequelize.FLOAT
            }

        },
        {
            tableName: 'Regions'
        }
    );



    region.initialize = function() {
        RegionDAO.hasMany(sequelize.models.Department);
        RegionDAO.hasMany(sequelize.models.Town);
    };

    region.setDAO(RegionDAO);
    region.setDataMapper(function mapToDomain(regionDataModel) {
        var domainRegion = new DomainRegion();
        domainRegion.id = regionDataModel.id;
        domainRegion.createdAt = regionDataModel.createdAt;
        domainRegion.updatedAt = regionDataModel.updatedAt;
        domainRegion.name = regionDataModel.name;
        domainRegion.code = regionDataModel.code;
        domainRegion.capital = regionDataModel.capital;
        domainRegion.latitude = regionDataModel.latitude;
        domainRegion.longitude = regionDataModel.longitude;

        return domainRegion;
    });

    return region;
}

module.exports = Region;