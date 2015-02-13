var _ = require('lodash');

function Listing() {
    var listing = {};

    listing.description = null;
    listing.price = 0;
    listing.num_rooms = null;
    listing.num_bathrooms = null;
    listing.num_bedrooms = 0;
    listing.construction_type = 0;
    listing.listing_url = null;
    listing.latitude = 0;
    listing.longitude = 0;
    listing.land_size = 0;
    listing.interior_size = 0;
    listing.total_size = 0;
    listing.year_built = 0;
    listing.is_rental = 0;
    listing.in_subdivision = 0;
    listing.feature_score = 0;
    listing.views = 0;

    listing.images = [];

    listing.town = null;
    listing.agency = null;


    return listing;
}

module.exports = Listing;