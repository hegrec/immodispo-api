var Base = require('./Base'),
    _ = require('lodash');

function Listing(server) {
    var listing = {};
    listing.__proto__ = new Base(server);

    listing.description = null;
    listing.price = 0;
    listing.numRooms = null;
    listing.numBathrooms = null;
    listing.numBedrooms = 0;
    listing.numToilets = 0;
    listing.numFloors = 0;
    listing.numParking = 0;
    listing.constructionType = 0;
    listing.listingUrl = null;
    listing.latitude = 0;
    listing.longitude = 0;
    listing.energyRating = 0;
    listing.carbonRating = 0;
    listing.basementSize = 0;
    listing.atticSize = 0;
    listing.landSize = 0;
    listing.interiorSize = 0;
    listing.totalSize = 0;
    listing.hasGarden = 0;
    listing.hasPool = 0;
    listing.hasKitchen = 0;
    listing.yearBuilt = 0;
    listing.isRental = 0;
    listing.inSubdivision = 0;
    listing.featureScore = 0;
    listing.views = 0;

    listing.images = [];

    listing.mapDataToDomain = function mapListingDataModel(listingDataModel) {
        var domainListing = Listing(server);
        domainListing.id = listingDataModel.id;
        domainListing.createdAt = listingDataModel.createdAt;
        domainListing.updatedAt = listingDataModel.updatedAt;
        domainListing.price = listingDataModel.price;
        domainListing.description = listingDataModel.description;
        domainListing.numRooms = listingDataModel.num_rooms;
        domainListing.numBathrooms = listingDataModel.num_bathrooms;
        domainListing.numBedrooms = listingDataModel.num_bedrooms;
        domainListing.numToilets = listingDataModel.num_toilets;
        domainListing.numFloors = listingDataModel.num_floors;
        domainListing.numParking = listingDataModel.num_parking;
        domainListing.constructionType = listingDataModel.construction_type;
        domainListing.listingUrl = listingDataModel.listing_url
        domainListing.latitude = listingDataModel.latitude;
        domainListing.longitude = listingDataModel.longitude;
        domainListing.energyRating = listingDataModel.energy_rating;
        domainListing.carbonRating = listingDataModel.carbon_rating;
        domainListing.basementSize = listingDataModel.basement_size;
        domainListing.atticSize = listingDataModel.attic_size;
        domainListing.landSize = listingDataModel.land_size;
        domainListing.interiorSize = listingDataModel.interior_size;
        domainListing.totalSize = listingDataModel.total_size;
        domainListing.hasGarden = listingDataModel.has_garden;
        domainListing.hasPool = listingDataModel.has_pool;
        domainListing.hasKitchen = listingDataModel.has_kitchen;
        domainListing.yearBuilt = listingDataModel.year_built;
        domainListing.isRental = listingDataModel.is_rental;
        domainListing.inSubdivision = listingDataModel.in_subdivision;
        domainListing.featureScore = listingDataModel.feature_score;
        domainListing.views = listingDataModel.views;



        var images = [];
        _.each(listingDataModel.images, function (imageFilename) {
            var domainImage = {
                standard_url: '/listingImages/' + imageFilename
            };
            images.push(domainImage);
        });

        domainListing.images = images;

        return domainListing;
    };

    listing.find = function listingFind(params, cb) {

        if (_.isUndefined(cb)) {
            cb = params;
            params = {};
        }

        server.data().listing.find(params, function(err, listingDataModels) {
            var models = [];

            if (err) {
                return cb(err);
            }

            _.each(listingDataModels, function(dataModel) {
                models.push(listing.mapDataToDomain(dataModel));
            });
            cb(null, models);
        });
    };

    return listing;
}

module.exports = Listing;