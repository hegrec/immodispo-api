var path = require('path'),
    Joi = require('joi'),
    async = require('async'),
    imageSaver = require('../lib/imagesaver/LocalImageSaver'),
    util = require('../lib/util'),
    env = require('../env'),
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

            reply.domain().region.find(function(err, regions) {

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
                        equals: request.params.id
                    }
                }
            };

            reply.domain().region.find(params, function(err, region) {

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

            reply.domain().department.find(function(err, departments) {

                if (err) throw err;

                if (!request.query.includeKml) {
                    _.each(departments, function(department) {
                        department.clearKML();
                    })
                }


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
                        equals: request.params.id
                    }
                }
            };

            reply.domain().department.find(params, function(err, department) {

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
            var queryParams = {};

            if (request.query.sort) {
                queryParams.sort = request.query.sort;
            }

            if (request.query.limit) {
                queryParams.limit = Number(request.query.limit);
            }

            reply.domain().town.find(queryParams, function(err, towns) {

                if (err) throw err;

                if (!request.query.includeKml) {
                    _.each(towns, function(town) {
                        town.clearKML();
                    })
                }

                reply(towns);
            });
        }
    });

    server.route({
        method: 'GET',
        path: '/towns/{id}',
        handler: function (request, reply) {

            reply.domain().town.get(request.params.id, function(err, town) {

                if (err) throw err;

                reply(town);
            });
        }
    });

    server.route({
        method: 'GET',
        path: '/agencies',
        handler: function (request, reply) {

            reply.domain().agency.find(function(err, agency) {

                if (err) throw err;

                reply(agency);
            });
        }
    });

    server.route({
        method: 'POST',
        path: '/agencies',
        handler: function (request, reply) {
            var models = reply.models(),
                imageInformation = request.payload.image,
                imageData = new Buffer(imageInformation.buffer, 'base64'),
                newAgency = {
                    name: request.payload.name,
                    address_1: request.payload.address_1,
                    address_2: request.payload.address_2,
                    telephone: request.payload.telephone,
                    email: request.payload.email,
                    website: request.payload.website,
                    TownId: request.payload.TownId,

                    image: util.generateFileName()+imageInformation.extension
                },
                imageFilePath = env.AGENCY_DIRECTORY + newAgency.image;



                imageSaver.saveImage(imageData, imageFilePath, function(err, saved) {

                    if (err) {
                        throw err;
                    }

                    if (saved) {
                        models.agency.create(newAgency, function (err, savedAgency) {

                            if (err) throw err;
                            console.log(savedAgency);
                            savedAgency.image = '/agencyImages/' + savedAgency.image;


                            reply(savedAgency);
                        });
                    }
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
                    TownId: Joi.number(),
                    image: Joi.object()
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/listings',
        handler: function (request, reply) {

            reply.domain().listing.find(function(err, town) {

                if (err) throw err;

                reply(town);
            });
        }
    });

    server.route({
        method: 'POST',
        path: '/listings/filter',
        handler: function (request, reply) {

            var filter = request.payload.filter;

            reply.domain().listing.find(filter, function(err, town) {

                if (err) throw err;

                reply(town);
            });
        },
        config: {
            validate: {
                payload: {
                    filter: Joi.object().required()
                }
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/listings',
        handler: function (request, reply) {
            var models = reply.domain(),
                newListing = {
                    price: request.payload.price,
                    description: request.payload.description,
                    num_rooms: request.payload.num_rooms,
                    num_bathrooms: request.payload.num_bathrooms,
                    num_bedrooms: request.payload.num_bedrooms,
                    num_toilets: request.payload.num_toilets,
                    num_floors: request.payload.num_floors,
                    num_parking: request.payload.num_parking,
                    construction_type: request.payload.construction_type,
                    listing_url: request.payload.listing_url,
                    latitude: request.payload.latitude,
                    longitude: request.payload.longitude,
                    energy_rating: request.payload.energy_rating,
                    carbon_rating: request.payload.carbon_rating,
                    basement_size: request.payload.basement_size,
                    attic_size: request.payload.attic_size,
                    land_size: request.payload.land_size,
                    interior_size: request.payload.interior_size,
                    total_size: request.payload.total_size,
                    has_garden: request.payload.has_garden,
                    has_pool: request.payload.has_pool,
                    has_kitchen: request.payload.has_kitchen,
                    year_built: request.payload.year_built,
                    is_rental: request.payload.is_rental,
                    in_subdivision: request.payload.in_subdivision,
                    feature_score: 0,
                    AgencyId: request.payload.AgencyId,
                    TownId: request.payload.TownId,
                    views: 0
                };

            console.log("creating listing");
            //first create the listing
            models.listing.create(newListing, function(err, savedListing) {

                if (err) throw err;

                savedListing.images = [];

                //now create the listing images
                var imageBufferFunctionMapper = [];
                _.each(request.payload.images, function(imageData) {
                    var buffer = new Buffer(imageData.buffer, 'base64');
                    var extension = imageData.extension;

                    var func = function saveListingImage(cb) {

                        var listingImage = {
                                filename: util.generateFileName()+extension,
                                ListingId: savedListing.id
                            },
                            imageFilePath = env.LISTING_DIRECTORY + listingImage.filename;

                        imageSaver.saveImage(buffer, imageFilePath, function(err, result) {

                            if (err) {
                                return cb(err);
                            }
                            //console.log(listingImage);
                            models.listingImage.create(listingImage, function(err, savedListingImage) {
                                savedListingImage.imageURL = '/listingImages/'+savedListingImage.filename;

                                cb(null, savedListingImage);
                            });
                        });
                    };
                    imageBufferFunctionMapper.push(func);
                });

                async.parallel(imageBufferFunctionMapper, function(err, savedImages) {

                    if (err) {
                        reply("error while saving listing");
                    } else {
                        savedListing.images = savedImages;
                        reply(savedListing);
                    }
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
                    images: Joi.array().min(5).required(),

                    description: Joi.string().required(),
                    num_rooms: Joi.number().required(),
                    num_bathrooms: Joi.number().required(),
                    num_bedrooms: Joi.number().required(),
                    num_toilets: Joi.number().required(),
                    num_floors: Joi.number().required(),
                    num_parking: Joi.number().required(),
                    latitude: Joi.number().required(),
                    longitude: Joi.number().required(),
                    energy_rating: Joi.number().required(),
                    carbon_rating: Joi.number().required(),
                    basement_size: Joi.number().required(),
                    attic_size: Joi.number().required(),
                    land_size: Joi.number().required(),
                    interior_size: Joi.number().required(),
                    has_garden: Joi.number().required(),
                    has_pool: Joi.number().required(),
                    has_kitchen: Joi.number().required(),
                    year_built: Joi.number().required(),
                    is_rental: Joi.number().required(),
                    in_subdivision: Joi.number().required()
                }
            }
        }
    });
};