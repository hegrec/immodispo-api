var Base = require('./Base');
var Sequelize = require('sequelize');


function Town(sequelize) {
    var town = {};
    town.__proto__ = new Base(sequelize);

    var TownDAO = sequelize.define('Town', {
            name: {
                type: Sequelize.STRING
            },
            code: {
                type: Sequelize.INTEGER
            },
            kml: {
                type: Sequelize.STRING
            },
            surface_area: {
                type: Sequelize.INTEGER
            },
            population: {
                type: Sequelize.INTEGER
            },
            latitude: {
                type: Sequelize.FLOAT
            },
            longitude: {
                type: Sequelize.FLOAT
            }
        },
        {
            tableName: 'town'
        }
    );

    town.initialize = function() {
        TownDAO.belongsTo(sequelize.models.Department, { key: 'department_id', foreignKey: 'department_id' });
        TownDAO.belongsTo(sequelize.models.Region,  { key: 'region_id', foreignKey: 'region_id' });
    };

    town.setDAO(TownDAO, ['Department', 'Region']);

    town.setDataMapper(function mapTownDataModel(townDataModel) {
        var domainTown = {};

        domainTown.id = townDataModel.id;
        domainTown.createdAt = townDataModel.createdAt;
        domainTown.updatedAt = townDataModel.updatedAt;
        domainTown.name = townDataModel.name;
        domainTown.code = townDataModel.code;
        domainTown.surface_area = townDataModel.surface_area;
        domainTown.population = townDataModel.population;
        domainTown.kml = townDataModel.kml;
        domainTown.latitude = townDataModel.latitude;
        domainTown.longitude = townDataModel.longitude;

        if (townDataModel.Department) {
            var domainDepartment = {};
            domainDepartment.id = townDataModel.Department.dataValues.id;
            domainDepartment.createdAt = townDataModel.Department.dataValues.createdAt;
            domainDepartment.updatedAt = townDataModel.Department.dataValues.updatedAt;
            domainDepartment.name = townDataModel.Department.dataValues.name;
            domainDepartment.code = townDataModel.Department.dataValues.code;
            domainDepartment.capital = townDataModel.Department.dataValues.capital;
            domainDepartment.kml = townDataModel.Department.dataValues.kml;
            domainDepartment.latitude = townDataModel.Department.dataValues.latitude;
            domainDepartment.longitude = townDataModel.Department.dataValues.longitude;
            domainTown.department = domainDepartment;
        }
        if (townDataModel.Region) {
            var domainRegion = {};
            domainRegion.id = townDataModel.Region.dataValues.id;
            domainRegion.createdAt = townDataModel.Region.dataValues.createdAt;
            domainRegion.updatedAt = townDataModel.Region.dataValues.updatedAt;
            domainRegion.name = townDataModel.Region.dataValues.name;
            domainRegion.code = townDataModel.Region.dataValues.code;
            domainRegion.capital = townDataModel.Region.dataValues.capital;
            domainRegion.latitude = townDataModel.Region.dataValues.latitude;
            domainRegion.longitude = townDataModel.Region.dataValues.longitude;
            domainTown.region = domainRegion;
        }

        return domainTown;
    });

    return town;
}

module.exports = Town;
