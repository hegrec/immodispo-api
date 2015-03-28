var Joi = require('joi'),
    util = require('../../lib/util'),
    DomainListing = require('./../../domain/Listing'),
    DomainListingImage = require('./../../domain/ListingImage'),
    DomainListingDetail = require('./../../domain/ListingDetail'),
    _ = require('lodash');

module.exports = function(server) {
    server.route({
        method: 'GET',
        path: '/listings',
        config: {
            auth: 'simple',
            handler: function (request, reply) {

                var filter = util.queryToFilter(request.query);

                server.data().listing.find(filter, function (err, town) {

                    if (err) throw err;

                    reply(town);
                });
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/listings/{id}',
        config: {
            auth: 'simple',
            handler: function (request, reply) {

                var filter = util.queryToFilter(request.query);
                filter.where.id = {
                    eq: Number(request.params.id)
                };

                server.data().listing.find(filter, function (err, listing) {

                    if (err) throw err;

                    reply(listing);
                });
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/listings',
        config: {
            auth: 'simple',
            handler: function (request, reply) {
                var models = server.data(),
                    newListing = new DomainListing(),
                    agencyParams = {
                        where: {
                            id: {
                                eq: Number(request.payload.AgencyId)
                            }
                        }
                    },
                    townParams = {
                        where: {
                            id: {
                                eq: Number(request.payload.TownId)
                            }
                        }
                    };

                newListing.price = request.payload.price;
                newListing.description = request.payload.description;
                newListing.num_rooms = request.payload.num_rooms;
                newListing.num_bathrooms = request.payload.num_bathrooms;
                newListing.num_bedrooms = request.payload.num_bedrooms;
                newListing.construction_type = request.payload.construction_type;
                newListing.listing_url = request.payload.listing_url;
                newListing.latitude = request.payload.latitude;
                newListing.longitude = request.payload.longitude;
                newListing.land_size = request.payload.land_size;
                newListing.interior_size = request.payload.interior_size;
                newListing.total_size = request.payload.total_size;
                newListing.year_built = request.payload.year_built;
                newListing.is_rental = request.payload.is_rental;
                newListing.feature_score = 0;
                newListing.views = 0;

                server.data().town.find(townParams, function (err, town) {

                    if (town.body.length < 1) throw new Error('Town was not found');

                    newListing.town = town.body[0];

                    server.data().agency.find(agencyParams, function (err, agency) {

                        if (agency.body.length < 1) throw new Error('Agency was not found');

                        newListing.agency = agency.body[0];

                        server.data().listing.create(newListing, function (err, savedListing) {
                            if (err) throw err;

                            reply(savedListing);
                        });
                    });
                });


            },
            validate: {
                payload: {
                    price: Joi.number().required(),
                    TownId: Joi.number().required(),
                    AgencyId: Joi.number().required(),
                    construction_type: Joi.string().required(),
                    listing_url: Joi.string().required(),
                    total_size: Joi.number().required(),
                    description: Joi.string().required(),
                    num_rooms: Joi.number().required(),
                    num_bathrooms: Joi.number().required(),
                    num_bedrooms: Joi.number().required(),
                    latitude: Joi.number(),
                    longitude: Joi.number(),
                    land_size: Joi.number(),
                    interior_size: Joi.number(),
                    year_built: Joi.number(),
                    is_rental: Joi.number().required()
                }
            }
        }
    });

    server.route({
        method: 'PUT',
        path: '/listings/{id}',
        config: {
            auth: 'simple',
            handler: function (request, reply) {
                var models = server.data(),
                    updatedListing = new DomainListing();

                updatedListing.price = request.payload.price;
                updatedListing.description = request.payload.description;
                updatedListing.num_rooms = request.payload.num_rooms;
                updatedListing.num_bathrooms = request.payload.num_bathrooms;
                updatedListing.num_bedrooms = request.payload.num_bedrooms;
                updatedListing.construction_type = request.payload.construction_type;
                updatedListing.listing_url = request.payload.listing_url;
                updatedListing.latitude = request.payload.latitude;
                updatedListing.longitude = request.payload.longitude;
                updatedListing.land_size = request.payload.land_size;
                updatedListing.interior_size = request.payload.interior_size;
                updatedListing.total_size = request.payload.total_size;
                updatedListing.year_built = request.payload.year_built;
                updatedListing.is_rental = request.payload.is_rental;
                updatedListing.feature_score = request.payload.feature_score;
                updatedListing.views = request.payload.views;

                server.data().listing.update(request.params.id, updatedListing, function (err, savedListing) {
                    if (err) throw err;

                    reply(savedListing);
                });
            },
            validate: {
                payload: {
                    price: Joi.number().optional(),
                    total_size: Joi.number().optional(),
                    description: Joi.string().optional(),
                    num_rooms: Joi.number().optional(),
                    num_bathrooms: Joi.number().optional(),
                    num_bedrooms: Joi.number().optional(),
                    latitude: Joi.number().optional(),
                    longitude: Joi.number().optional(),
                    land_size: Joi.number().optional(),
                    interior_size: Joi.number().optional(),
                    year_built: Joi.number().optional()
                }
            }
        }
    });

    server.route({
        method: 'DELETE',
        path: '/listings/{id}',
        config: {
            auth: 'simple',
            handler: function (request, reply) {
                var models = server.data();

                server.data().listing.delete(request.params.id, function (err, savedListing) {
                    if (err) throw err;

                    reply(true);
                });
            },
            validate: {
                payload: {}
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/listings/{id}/images',
        config: {
            auth: 'simple',
            handler: function (request, reply) {
                var newListingImage = new DomainListingImage(),
                    listingParams = {
                        where: {
                            id: {
                                eq: Number(request.params.id)
                            }
                        }
                    };

                newListingImage.filename = util.generateFileName() + request.payload.extension;
                newListingImage.buffer = request.payload.buffer;

                server.data().listing.find(listingParams, function (err, listing) {

                    if (listing.body.length < 1) throw new Error('Listing was not found');

                    newListingImage.listing = listing.body[0];
                    //console.log(listing[0]);

                    server.data().listingImage.create(newListingImage, function (err, savedListingImage) {
                        if (err) throw err;

                        reply(savedListingImage);
                    });
                });


            },
            validate: {
                payload: {
                    extension: Joi.string().required(),
                    buffer: Joi.string().required(),
                }
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/listings/{id}/details',
        config: {
            auth: 'simple',
            handler: function (request, reply) {
                var newListingDetail = new DomainListingDetail(),
                    listingParams = {
                        where: {
                            id: {
                                eq: Number(request.params.id)
                            }
                        }
                    };

                newListingDetail.key = request.payload.key;
                newListingDetail.value = request.payload.value;

                server.data().listing.find(listingParams, function (err, listing) {

                    if (listing.body.length < 1) throw new Error('Listing was not found');

                    newListingDetail.listing = listing.body[0];
                    //console.log(listing[0]);

                    server.data().listingDetail.create(newListingDetail, function (err, savedListingDetail) {
                        if (err) throw err;

                        reply(savedListingDetail);
                    });
                });
            },
            validate: {
                payload: {
                    key: Joi.string().required(),
                    value: Joi.string().required()
                }
            }
        }
    });
};