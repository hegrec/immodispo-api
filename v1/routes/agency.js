var Joi = require('joi'),
    util = require('../../lib/util'),
    DomainAgency = require('./../../domain/Agency'),
    _ = require('lodash');

module.exports = function(server) {

    server.route({
        method: 'GET',
        path: '/agencies',
        config: {
            auth: 'simple',
            handler: function (request, reply) {
                var filter = util.queryToFilter(request.query);

                server.data().agency.find(filter, function (err, agency) {

                    if (err) throw err;

                    reply(agency);
                });
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/agencies/{id}',
        config: {
            auth: 'simple',
            handler: function (request, reply) {
                var params = {
                    where: {
                        id: {
                            eq: Number(request.params.id)
                        }
                    }
                };

                server.data().agency.find(params, function (err, agency) {

                    if (err) throw err;

                    reply(agency);
                });
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/agencies',
        config: {
            auth: 'simple',
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

                server.data().town.find(params, function (err, town) {

                    if (town.body.length < 1) throw new Error('Town was not found');
                    newAgency.town = town.body[0];

                    server.data().agency.create(newAgency, buffer, function (err, savedAgency) {
                        if (err) throw err;

                        reply(savedAgency);
                    });
                });
            },
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
};