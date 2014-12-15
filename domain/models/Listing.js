var Base = require('./Base');

function Listing(db) {
    var listing = {};
    listing.__proto__ = new Base(db);

    listing.setTableName('Listings');
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

    return listing;
}

module.exports = Listing;