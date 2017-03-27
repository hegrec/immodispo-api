var mmm = require('mmmagic');
var Sequelize = require('sequelize');
var Base = require('./Base');
var util = require('./../../lib/util');
var imageSaver = require('./../../lib/imagesaver/LocalImageSaver');
var env = require('./../../env');

function Agency(sequelize) {
  var agency = {};
  agency.__proto__ = new Base(sequelize);

  var AgencyDAO = sequelize.define('agency', {
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
      tableName: 'agency'
    }
  );

  agency.setDAO(AgencyDAO, ['Town']);

  var agencyDataMapper = function mapAgencyDataModel(agencyDataModel) {
    var domainAgency = {};

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
      domainAgency.town = {};
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
  agency.create = function agencyCreate(agencyData, cb) {
    const imageFile = "agencyImages/" + util.generateFileName();

    if (agencyData.image) {
      const imageBuffer = new Buffer(agencyData.image, 'base64');
      mmm.detect(imageBuffer, (err, result) => {
        if (err) {
          throw err;
        }

        console.log(result);
  /*
        imageSaver.saveImage(imageBuffer, imageFile, function (err, saved) {

          if (err) {
            throw err;
          }

          if (saved) {

            var savable = AgencyDAO.build({
              name: agencyData.name),
              image: agencyData.image,
              address_1: agencyData.address_1),
              address_2: agencyData.address_2),
              telephone: agencyData.telephone),
              email: agencyData.email),
              website: agencyData.website),
              town_id: Number(agencyData.town.id)

            });

            savable.save().then(
              function (savedAgency) {
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
              },
              function(err) {
                throw err;
              }
            );
          }
        });*/
      });
    }

    return AgencyDAO.create({
        name: agencyData.name,
        address_1: agencyData.address_1,
        address_2: agencyData.address_2,
        telephone: agencyData.telephone,
        email: agencyData.email,
        website: agencyData.website,
        town_id: Number(agencyData.town_id)
      })
      .then(savedAgency => agency.findById(savedAgency.dataValues.id))
      .catch(error => console.error(error));
  };

  agency.initialize = function() {
    AgencyDAO.belongsTo(sequelize.models.Town, { key: 'town_id', foreignKey: 'town_id'});
  };


  return agency;
}


module.exports = Agency;
