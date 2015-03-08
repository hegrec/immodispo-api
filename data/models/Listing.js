var Base = require('./Base'),
    async = require('async'),
    Sequelize = require('sequelize'),
    _ = require('lodash'),
    DomainListing = require('./../../domain/Listing'),
    DomainListingDetail = require('./../../domain/ListingDetail'),
    DomainAgency = require('./../../domain/Agency'),
    DomainTown = require('./../../domain/Town'),
    util = require('./../../lib/util');
    imageSaver = require('./../../lib/imagesaver/LocalImageSaver'),
    env = require('./../../env');



var computeFeatureScore = function computeFeatureScore(listing) {
    var score = 0;

    if (listing.num_rooms) {
        score += 1;
    }

    if (listing.Agency.email) {
        score += 5;
    }

    if (listing.Agency.telephone) {
        score += 5;
    }

    if (listing.num_bathrooms) {
        score += 1;
    }

    if (listing.num_bedrooms) {
        score += 1;
    }

    if (listing.year_built) {
        score += 1;

        if (listing.year_built > 1970) {
            score += 5;
        }
    }

    score += Math.floor(listing.ListingImages.length / 2);
    score += Math.floor(listing.ListingDetails.length / 2);

    return score;
};

function Listing(sequelize) {
    var listing = {};
    listing.__proto__ = new Base(sequelize);

    var ListingDAO = sequelize.define('Listing', {
            price: {
                type: Sequelize.INTEGER
            },
            description: {
                type: Sequelize.STRING
            },
            num_rooms: {
                type: Sequelize.INTEGER,
                field: "num_rooms"
            },
            num_bathrooms: {
                type: Sequelize.INTEGER,
                field: "num_bathrooms"
            },
            num_bedrooms: {
                type: Sequelize.INTEGER,
                field: "num_bedrooms"
            },
            construction_type: {
                type: Sequelize.INTEGER,
                field: "construction_type"
            },
            listing_url: {
                type: Sequelize.STRING,
                field: "listing_url"
            },
            latitude: {
                type: Sequelize.FLOAT
            },
            longitude: {
                type: Sequelize.FLOAT
            },
            land_size: {
                type: Sequelize.FLOAT,
                field: "land_size"
            },
            interior_size: {
                type: Sequelize.FLOAT,
                field: "interior_size"
            },
            total_size: {
                type: Sequelize.FLOAT,
                field: "total_size"
            },
            year_built: {
                type: Sequelize.INTEGER,
                field: "year_built"
            },
            is_rental: {
                type: Sequelize.INTEGER,
                field: "is_rental"
            },
            feature_score: {
                type: Sequelize.INTEGER,
                field: "feature_score"
            },
            views: {
                type: Sequelize.INTEGER
            }
        },
        {
            tableName: 'Listings'
        }
    );



    listing.initialize = function() {
        ListingDAO.belongsTo(sequelize.models.Agency);
        ListingDAO.belongsTo(sequelize.models.Town);
        ListingDAO.hasMany(sequelize.models.ListingImage, {
            onDelete: 'cascade',
            hooks: true
        });
        ListingDAO.hasMany(sequelize.models.ListingDetail);
    };

    listing.setDAO(ListingDAO, ['Agency', 'Town', 'ListingImage', 'ListingDetail']);

    var listingDataMapper = function mapListingDataModel(listingDataModel) {
        var domainListing = new DomainListing(),
            images = [];

        domainListing.id = listingDataModel.id;
        domainListing.createdAt = listingDataModel.createdAt;
        domainListing.updatedAt = listingDataModel.updatedAt;
        domainListing.price = listingDataModel.price;
        domainListing.description = listingDataModel.description;
        domainListing.num_rooms = listingDataModel.num_rooms;
        domainListing.num_bathrooms = listingDataModel.num_bathrooms;
        domainListing.num_bedrooms = listingDataModel.num_bedrooms;
        domainListing.construction_type = listingDataModel.construction_type;
        domainListing.listing_url = listingDataModel.listing_url;
        domainListing.latitude = listingDataModel.latitude;
        domainListing.longitude = listingDataModel.longitude;
        domainListing.land_size = listingDataModel.land_size;
        domainListing.interior_size = listingDataModel.interior_size;
        domainListing.total_size = listingDataModel.total_size;
        domainListing.year_built = listingDataModel.year_built;
        domainListing.is_rental = listingDataModel.is_rental;
        domainListing.feature_score = listingDataModel.feature_score;
        domainListing.views = listingDataModel.views;

        if (typeof listingDataModel.Town !== 'undefined') {
            domainListing.town = new DomainTown();
            domainListing.town.id = listingDataModel.Town.dataValues.id;
            domainListing.town.name = listingDataModel.Town.dataValues.name;
            domainListing.town.code = listingDataModel.Town.dataValues.code;
            domainListing.town.kml = listingDataModel.Town.dataValues.kml;
            domainListing.town.surface_area = listingDataModel.Town.dataValues.surface_area;
            domainListing.town.population = listingDataModel.Town.dataValues.population;
            domainListing.town.latitude = listingDataModel.Town.dataValues.latitude;
            domainListing.town.longitude = listingDataModel.Town.dataValues.longitude;
        } else {
            domainListing.town = listingDataModel.TownId;
        }

        if (typeof listingDataModel.Agency !== 'undefined') {
            domainListing.agency = new DomainAgency();
            domainListing.agency.id = listingDataModel.Agency.dataValues.id;
            domainListing.agency.name = listingDataModel.Agency.dataValues.name;
            domainListing.agency.image = "/agencyImages/" + listingDataModel.Agency.dataValues.image;
            domainListing.agency.address_1 = listingDataModel.Agency.dataValues.address_1;
            domainListing.agency.address_2 = listingDataModel.Agency.dataValues.address_2;
            domainListing.agency.telephone = listingDataModel.Agency.dataValues.telephone;
            domainListing.agency.email = listingDataModel.Agency.dataValues.email;
            domainListing.agency.website = listingDataModel.Agency.dataValues.website;
        } else {
            domainListing.agency = listingDataModel.AgencyId;
        }


        if (_.isArray(listingDataModel.ListingImages)) {
            _.each(listingDataModel.ListingImages, function (image) {
                var domainImage = {
                    standard_url: '/listingImages/' + image.dataValues.filename
                };
                images.push(domainImage);
            });
        }

        domainListing.images = images;

        var details = [];
        if (_.isArray(listingDataModel.ListingDetails)) {
            _.each(listingDataModel.ListingDetails, function (detail) {
                details.push({
                    key: detail.dataValues.key,
                    value: detail.dataValues.value
                });
            });
        }

        domainListing.details = details;

        return domainListing;
    };

    listing.setDataMapper(listingDataMapper);

    listing.create = function listingCreate(listingData, cb) {
        var savable = ListingDAO.build({
            price: listingData.price,
            description: listingData.description,
            num_rooms: listingData.num_rooms,
            num_bathrooms: listingData.num_bathrooms,
            num_bedrooms: listingData.num_bedrooms,
            construction_type: listingData.construction_type,
            listing_url: listingData.listing_url,
            latitude: listingData.latitude,
            longitude: listingData.longitude,
            land_size: listingData.land_size,
            interior_size: listingData.interior_size,
            total_size: listingData.total_size,
            year_built: listingData.year_built,
            is_rental: listingData.is_rental,
            feature_score: listingData.feature_score,
            views: listingData.views,
            AgencyId: listingData.agency.id,
            TownId: listingData.town.id
        });

        savable.save().complete(function (err, savedListing) {
            if (err) throw err;
            cb(null, savedListing);
        });
    };

    listing.update = function listingUpdate(id, listingData, cb) {


        ListingDAO.find({
            where: {
                id: id
            },
            include: [sequelize.models.ListingImage, sequelize.models.ListingDetail, sequelize.models.Agency]
        }).then(function(listing) {

            _.forOwn(listingData, function(value, key) {

                if (!_.isUndefined(value)) {
                    listing[key] = value;
                }
            });

            listing.feature_score = computeFeatureScore(listing);

            listing.save().complete(function (err, savedListing) {
                if (err) throw err;
                cb(null, savedListing);
            });
        });
    };

    listing.delete = function listingDelete(id, cb) {

        ListingDAO.find(id).then(function(listing) {

            listing.destroy().then(function() {
                    cb(null, true);
                }
            )
        });
    };

    return listing;
}


module.exports = Listing;