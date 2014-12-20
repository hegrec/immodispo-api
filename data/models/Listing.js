var Base = require('./Base'),
    squel = require('squel'),
    _ = require('lodash');

function Listing(pool) {
    var tableName = 'Listings';
    var imagesTableName = 'ListingImages';
    var listing = {};
    listing.__proto__ = new Base(pool);


    listing.setTableName(tableName);
    listing.setSchema({
        name: String,
        code: Number,
        description: String,
        price: Number,
        num_rooms: Number,
        num_bathrooms: Number,
        num_bedrooms: Number,
        num_toilets: Number,
        num_floors: Number,
        num_parking: Number,
        construction_type: Number,
        listing_url: Number,
        energy_rating: Number,
        carbon_rating: Number,
        basement_size: Number,
        attic_size: Number,
        land_size: Number,
        interior_size: Number,
        total_size: Number,
        has_garden: Boolean,
        has_pool: Boolean,
        has_kitchen: Boolean,
        year_built: Number,
        is_rental: Boolean,
        in_subdivision: Boolean,
        feature_score: Number,
        views: Number,
        latitude: Number,
        longitude: Number,
        TownId: Number,
        AgencyId: Number
    });

    listing.find = function queryListings(params, cb) {
        var select = squel.select().from(tableName);

        select = this.buildFilterParams(params, select);

        select.left_join(imagesTableName, null, 'Listings.id=ListingImages.ListingId');

        var query = select.toString();

        console.log(query);

        pool.getConnection(function(err, connection) {
            connection.query(query, function(err, rows, fields) {
                connection.release();
                if (err) {
                    return cb(err);
                }

                var listingMap = {};
                var listingImageCollections = {};
                _.each(rows, function(row) {
                    if (_.isUndefined(listingMap[row.ListingId])) {
                        console.log("new lisitng");
                        listingMap[row.ListingId] = row;
                    }

                    listingMap[row.ListingId] = row;
                    row.id = row.ListingId;

                    if (_.isUndefined(listingImageCollections[row.ListingId])) {
                        listingImageCollections[row.ListingId] = [];
                    }

                    listingImageCollections[row.ListingId].push(row.filename);

                });

                var listings = [];
                _.forOwn(listingMap, function(listing, listingId) {

                    listing.images = listingImageCollections[listingId];
                    listings.push(listing);
                });


                cb(null, listings);
            });
        });


    };

    return listing;
}

module.exports = Listing;