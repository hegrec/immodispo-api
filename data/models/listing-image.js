var _ = require('lodash');
var Sequelize = require('sequelize');
var Base = require('./base');
const imageDetector = require('./../../lib/imagesaver/detector');
var imageSaver = require('./../../lib/imagesaver/RemoteImageSaver');
var env = require('./../../env');
var util = require('./../../lib/util');

function ListingImage(sequelize) {
  var listingImage = {};
  listingImage.__proto__ = new Base(sequelize);

  var ListingImageDAO = sequelize.define('listing_image', {
    filename: {
      type: Sequelize.STRING
    }
  }, {
    freezeTableName: true,
    tableName: 'listing_image'
  });

  ListingImageDAO.hook('afterDestroy', function(listingImage, options, fn) {
    var imagePath = 'listingImages/' + listingImage.filename;
    console.log('destroying ' + imagePath);
    imageSaver.deleteImage(imagePath)
      .then(() => fn(null, true));
  });


  listingImage.setDAO(ListingImageDAO);

  var listingDataMapper = function mapListingDataModel(listingDataModel) {
    var domainListing = {};
    domainListing.id = listingDataModel.id;
    domainListing.createdAt = listingDataModel.createdAt;
    domainListing.updatedAt = listingDataModel.updatedAt;
    domainListing.filename = listingDataModel.filename;

    return domainListing;
  };

  listingImage.setDataMapper(listingDataMapper);

  listingImage.create = function (listingId, buffer) {
    const ext = imageDetector(buffer).ext;
    const fileName = `${util.generateFileName()}.${ext}`;
    const savable = ListingImageDAO.build({
      filename: fileName,
      listing_id: listingId
    });

    return imageSaver.saveImage(buffer, fileName)
      .then(result => savable.save())
  };

  return listingImage;
}

module.exports = ListingImage;
