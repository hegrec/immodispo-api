var util = require('../../lib/util'),
    Joi = require('joi'),
    _ = require('lodash');

module.exports = function(server) {
    server.route({
        method: 'GET',
        path: '/departments',
        config: {
            auth: 'simple',
            handler: function (request, reply) {
                var filter = util.queryToFilter(request.query);

                server.data().department.find(filter, function (err, departments) {

                    if (err) throw err;

                    reply(departments);
                });
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/departments/{id}',
        config: {
            auth: 'simple',
            handler: function (request, reply) {
                var filter = util.queryToFilter(request.query);
                filter.where.id = {
                    eq: Number(request.params.id)
                };

                server.data().department.find(filter, function (err, department) {

                    if (err) throw err;

                    reply(department);
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