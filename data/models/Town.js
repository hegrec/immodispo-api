var Base = require('./Base'),
    Sequelize = require('sequelize'),
    DomainTown = require('./../../domain/Town');

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
            tableName: 'Towns'
        }
    );

    TownDAO.hasOne(sequelize.models.Department);
    TownDAO.hasOne(sequelize.models.Region);

    town.setDAO(TownDAO);

    town.setDataMapper(function mapTownDataModel(townDataModel) {
        var domainTown = new DomainTown();

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

        return domainTown;
    });

    return town;
}

module.exports = Town;