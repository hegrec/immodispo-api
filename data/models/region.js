var Sequelize = require('sequelize');
var _ = require('lodash');
var BaseDAO = require('./base');

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
            tableName: 'region'
        }
    );



    region.initialize = function() {
        RegionDAO.hasMany(sequelize.models.Department, { foreignKey: 'region_id'});
        RegionDAO.hasMany(sequelize.models.Town, { foreignKey: 'region_id'});
    };

    region.setDAO(RegionDAO);
    region.setDataMapper(function mapToDomain(regionDataModel) {
        var domainRegion = {};
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
