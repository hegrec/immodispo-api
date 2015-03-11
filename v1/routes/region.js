var util = require('../../lib/util'),
    Joi = require('joi'),
    _ = require('lodash');

module.exports = function(server) {
    server.route({
        method: 'GET',
        path: '/regions',
        config: {
            auth: 'simple',
            handler: function (request, reply) {
                var filter = util.queryToFilter(request.query);

                server.data().region.find(filter, function (err, regions) {

                    if (err) throw err;

                    reply(regions);
                });
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/regions/{id}',
        config: {
            auth: 'simple',
            handler: function (request, reply) {
                var params = {
                    where: {
                        id: {
                            eq: request.params.id
                        }
                    }
                };

                server.data().region.find(params, function (err, region) {

                    if (err) throw err;

                    reply(region);
                });
            },
            validate: {
                params: {
                    id: Joi.number().required()
                }
            }
        }
    });
};