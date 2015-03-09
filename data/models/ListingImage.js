var Base = require('./Base'),
    async = require('async'),
    Sequelize = require('sequelize'),
    _ = require('lodash'),
    DomainListingImage = require('./../../domain/ListingImage'),
    imageSaver = require('./../../lib/imagesaver/S3ImageSaver'),
    env = require('./../../env');

function ListingImage(sequelize) {
    var listingImage = {};
    listingImage.__proto__ = new Base(sequelize);

    var ListingImageDAO = sequelize.define('ListingImage', {
        filename: {
            type: Sequelize.STRING
        }
    });

    ListingImageDAO.hook('afterDestroy', function(listingImage, options, fn) {
        var imagePath = listingImage.filename;
        console.log('destroying ' + imagePath);
        imageSaver.deleteImage(imagePath, function(err, status) {
            fn(null, true);
        });
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
            imageFile = listingImageData.filename;

        imageSaver.saveImage(buffer, imageFile, function(err, result) {

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