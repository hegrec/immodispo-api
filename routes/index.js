var Joi = require('joi'),
    util = require('../lib/util'),
    DomainAgency = require('./../domain/Agency'),
    DomainListing = require('./../domain/Listing'),
    DomainListingImage = require('./../domain/ListingImage'),
    DomainListingDetail = require('./../domain/ListingDetail'),
    _ = require('lodash');

module.exports = function(server) {

    server.route({
        method: 'GET',
        path: '/',
        handler: function (request, reply) {
            var indexResponse = {
                body: "Welcome to the Immodispo API. Please see the documentation at http://somesite.com/docs/api"
            };

            reply(indexResponse);
        }
    });

    server.route({
        method: 'GET',
        path: '/regions',
        handler: function (request, reply) {

            server.data().region.find(function(err, regions) {

                if (err) throw err;

                reply(regions);
            });
        }
    });

    server.route({
        method: 'GET',
        path: '/regions/{id}',
        handler: function (request, reply) {
            var params = {
                where: {
                    id: {
                        eq: request.params.id
                    }
                }
            };

            server.data().region.find(params, function(err, region) {

                if (err) throw err;

                reply(region);
            });
        },
        config: {
            validate: {
                params: {
                    id: Joi.number().required()
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/departments',
        handler: function (request, reply) {

            server.data().department.find(function(err, departments) {

                if (err) throw err;

                reply(departments);
            });
        }
    });

    server.route({
        method: 'GET',
        path: '/departments/{id}',
        handler: function (request, reply) {
            var params = {
                where: {
                    id: {
                        eq: request.params.id
                    }
                }
            };

            server.data().department.find(params, function(err, department) {

                if (err) throw err;

                reply(department);
            });
        },
        config: {
            validate: {
                params: {
                    id: Joi.number().required()
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/towns',
        handler: function (request, reply) {
            var filter = util.queryToFilter(request.query);

            server.data().town.find(filter, function(err, towns) {

                if (err) throw err;

                reply(towns);
            });
        }
    });

    server.route({
        method: 'GET',
        path: '/towns/{id}',
        handler: function (request, reply) {

            var params = {
                where: {
                    id: {
                        eq: Number(request.params.id)
                    }
                }
            };

            server.data().town.find(params, function(err, town) {

                if (err) throw err;

                reply(town);
            });
        }
    });

    server.route({
        method: 'GET',
        path: '/agencies',
        handler: function (request, reply) {
            var filter = util.queryToFilter(request.query);

            server.data().agency.find(filter, function(err, agency) {

                if (err) throw err;

                reply(agency);
            });
        }
    });

    server.route({
        method: 'GET',
        path: '/agencies/{id}',
        handler: function (request, reply) {
            var params = {
                where: {
                    id: {
                        eq: Number(request.params.id)
                    }
                }
            };

            server.data().agency.find(params, function(err, agency) {

                if (err) throw err;

                reply(agency);
            });
        }
    });

    server.route({
        method: 'POST',
        path: '/agencies',
        handler: function (request, reply) {
            var newAgency = new DomainAgency(),
                params = {
                where: {
                    id: {
                        eq: Number(request.payload.TownId)
                    }
                }
            };

            newAgency.name = request.payload.name;
            newAgency.address_1 = request.payload.address_1;
            newAgency.address_2 = request.payload.address_2;
            newAgency.telephone = request.payload.telephone;
            newAgency.email = request.payload.email;
            newAgency.website = request.payload.website;

            var buffer;
            if (request.payload.image) {
                newAgency.image = util.generateFileName() + request.payload.image.extension;
                buffer = request.payload.image.buffer;
            }

            server.data().town.find(params, function(err, town) {

                if (town.body.length < 1) throw new Error('Town was not found');
                newAgency.town = town.body[0];

                server.data().agency.create(newAgency, buffer, function(err, savedAgency) {
                    if (err) throw err;

                    reply(savedAgency);
                });
            });
        },
        config: {
            validate: {
                payload: {
                    name: Joi.string().required(),
                    address_1: Joi.string().required(),
                    address_2: Joi.string(),
                    telephone: Joi.string(),
                    email: Joi.string(),
                    website: Joi.string(),
                    TownId: Joi.number().required(),
                    image: Joi.object()
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/listings',
        handler: function (request, reply) {

            var filter = util.queryToFilter(request.query);

            server.data().listing.find(filter, function(err, town) {

                if (err) throw err;

                reply(town);
            });
        }
    });

    server.route({
        method: 'GET',
        path: '/listings/{id}',
        handler: function (request, reply) {
            var params = {
                where: {
                    id: {
                        eq: Number(request.params.id)
                    }
                }
            };

            server.data().listing.find(params, function(err, listing) {

                if (err) throw err;

                reply(listing);
            });
        }
    });

    server.route({
        method: 'POST',
        path: '/listings',
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

            server.data().town.find(townParams, function(err, town) {

                if (town.body.length < 1) throw new Error('Town was not found');

                newListing.town = town.body[0];

                server.data().agency.find(agencyParams, function(err, agency) {

                    if (agency.body.length < 1) throw new Error('Agency was not found');

                    newListing.agency = agency.body[0];

                    server.data().listing.create(newListing, function(err, savedListing) {
                        if (err) throw err;

                        reply(savedListing);
                    });
                });
            });


        },
        config: {
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
                    is_rental: Joi.boolean().required()
                }
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/listings/{id}/images',
        handler: function (request, reply) {
            var newListingImage = new DomainListingImage(),
                listingParams = {
                    where: {
                        id: {
                            eq: Number(request.params.id)
                        }
                    }
                };

            newListingImage.filename = util.generateFileName()+request.payload.extension;
            newListingImage.buffer = request.payload.buffer;

            server.data().listing.find(listingParams, function(err, listing) {

                if (listing.body.length < 1) throw new Error('Listing was not found');

                newListingImage.listing = listing.body[0];
                //console.log(listing[0]);

                server.data().listingImage.create(newListingImage, function(err, savedListingImage) {
                    if (err) throw err;

                    reply(savedListingImage);
                });
            });


        },
        config: {
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

            server.data().listing.find(listingParams, function(err, listing) {

                if (listing.body.length < 1) throw new Error('Listing was not found');

                newListingDetail.listing = listing.body[0];
                //console.log(listing[0]);

                server.data().listingDetail.create(newListingDetail, function(err, savedListingDetail) {
                    if (err) throw err;

                    reply(savedListingDetail);
                });
            });


        },
        config: {
            validate: {
                payload: {
                    key: Joi.string().required(),
                    value: Joi.string().required()
                }
            }
        }
    });
};