var Base = require('./Base'),
    _ = require('lodash'),
    util = require('./../../lib/util'),
    imageSaver = require('./../../lib/imagesaver/LocalImageSaver'),
    env = require('./../../env'),
    Sequelize = require('sequelize'),
    DomainAgency = require('./../../domain/Agency'),
    DomainTown = require('./../../domain/Town');

function Agency(sequelize) {
    var agency = {};
    agency.__proto__ = new Base(sequelize);

    var AgencyDAO = sequelize.define('Agency', {
            name: {
                type: Sequelize.STRING
            },
            image: {
                type: Sequelize.STRING
            },
            address_1: {
                type: Sequelize.STRING
            },
            address_2: {
                type: Sequelize.STRING
            },
            telephone: {
                type: Sequelize.STRING
            },
            email: {
                type: Sequelize.STRING
            },
            website: {
                type: Sequelize.STRING
            }
        },
        {
            tableName: 'Agencies'
        }
    );

    agency.setDAO(AgencyDAO, ['Town']);

    var agencyDataMapper = function mapAgencyDataModel(agencyDataModel) {
        var domainAgency = new DomainAgency();

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

        if (agencyDataModel.Town) {
            domainAgency.town = new DomainTown();
            domainAgency.town.id = agencyDataModel.Town.dataValues.id;
            domainAgency.town.name = agencyDataModel.Town.dataValues.name;
            domainAgency.town.code = agencyDataModel.Town.dataValues.code;
            domainAgency.town.kml = agencyDataModel.Town.dataValues.kml;
            domainAgency.town.surface_area = agencyDataModel.Town.dataValues.surface_area;
            domainAgency.town.population = agencyDataModel.Town.dataValues.population;
            domainAgency.town.latitude = agencyDataModel.Town.dataValues.latitude;
            domainAgency.town.longitude = agencyDataModel.Town.dataValues.longitude;
        }

        return domainAgency;
    };

    agency.setDataMapper(agencyDataMapper);
    agency.create = function agencyCreate(agencyData, agencyImageBuffer, cb) {

        var imageFilePath = env.AGENCY_DIRECTORY + agencyData.image,
            imageData;

        if (agencyImageBuffer) {
            imageData = new Buffer(agencyImageBuffer, 'base64');
            imageSaver.saveImage(imageData, imageFilePath, function (err, saved) {

                if (err) {
                    throw err;
                }

                if (saved) {

                    var savable = AgencyDAO.build({
                        name: util.mysql_real_escape_string(agencyData.name),
                        image: agencyData.image,
                        address_1: util.mysql_real_escape_string(agencyData.address_1),
                        address_2: util.mysql_real_escape_string(agencyData.address_2),
                        telephone: util.mysql_real_escape_string(agencyData.telephone),
                        email: util.mysql_real_escape_string(agencyData.email),
                        website: util.mysql_real_escape_string(agencyData.website),
                        TownId: Number(agencyData.town.id)

                    });

                    savable.save().complete(function (err, savedAgency) {
                        if (err) throw err;
                        var filter = {
                            where: {
                                id: {
                                    "eq": savedAgency.dataValues.id
                                }
                            }
                        };
                        agency.find(filter, function (err, agency) {
                            cb(null, agency.body[0]);
                        });


                    });

                }
            });
        } else {
            var savable = AgencyDAO.build({
                name: util.mysql_real_escape_string(agencyData.name),
                address_1: util.mysql_real_escape_string(agencyData.address_1),
                address_2: util.mysql_real_escape_string(agencyData.address_2),
                telephone: util.mysql_real_escape_string(agencyData.telephone),
                email: util.mysql_real_escape_string(agencyData.email),
                website: util.mysql_real_escape_string(agencyData.website),
                TownId: Number(agencyData.town.id)

            });

            savable.save().complete(function (err, savedAgency) {
                if (err) throw err;
                var filter = {
                    where: {
                        id: {
                            "eq": savedAgency.dataValues.id
                        }
                    }
                };
                agency.find(filter, function (err, agency) {
                    cb(null, agency.body[0]);
                });


            });
        }
    };

    agency.initialize = function() {
        AgencyDAO.belongsTo(sequelize.models.Town);
    };


    return agency;
}


module.exports = Agency;