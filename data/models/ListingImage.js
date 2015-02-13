var Base = require('./Base'),
    async = require('async'),
    Sequelize = require('sequelize'),
    _ = require('lodash'),
    DomainListingImage = require('./../../domain/ListingImage'),
    imageSaver = require('./../../lib/imagesaver/LocalImageSaver'),
    env = require('./../../env');

function ListingImage(sequelize) {
    var listingImage = {};
    listingImage.__proto__ = new Base(sequelize);

    var ListingImageDAO = sequelize.define('ListingImage', {
        filename: {
            type: Sequelize.STRING
        }
    });

    listingImage.setDAO(ListingImageDAO);

    var listingDataMapper = function mapListingDataModel(listingDataModel) {
        var domainListing = new DomainListingImage();
        domainListing.id = listingDataModel.id;
        domainListing.createdAt = listingDataModel.createdAt;
        domainListing.updatedAt = listingDataModel.updatedAt;
        domainListing.filename = listingDataModel.filename;

        return domainListing;
    };

    listingImage.setDataMapper(listingDataMapper);

    listingImage.create = function listingImageCreate(listingImageData, cb) {
        var savable = ListingImageDAO.build({
            filename: listingImageData.filename,
            ListingId: listingImageData.listing.id
        });

        var buffer = new Buffer(listingImageData.buffer, 'base64'),
            imageFilePath = env.LISTING_DIRECTORY + listingImageData.filename;

        imageSaver.saveImage(buffer, imageFilePath, function(err, result) {

            if (err) {
                return cb(err);
            }

            savable.save().complete(function(err, savedListingImage) {
                if (err) throw err;
                cb(null, savedListingImage);
            });
        });
    };

    return listingImage;
}

module.exports = ListingImage;