var Base = require('./Base');

function ListingImage(db) {
    var listingImage = {};
    listingImage.__proto__ = new Base(db);

    listingImage.setTableName('ListingImages');
    listingImage.setSchema({
        filename: String,
        ListingId: Number
    });

    return listingImage;
}

module.exports = ListingImage;