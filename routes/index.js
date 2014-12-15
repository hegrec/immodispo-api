var path = require('path'),
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

            var queryParams = server.responsify().buildQueryParameters(request);

            reply.models().region.find(function(err, regions) {

                if (err) throw err;

                reply(regions);
            });
        }
    });

    server.route({
        method: 'GET',
        path: '/regions/{id}',
        handler: function (request, reply) {

            reply.models().region.get(request.params.id, function(err, region) {

                if (err) throw err;

                reply(region);
            });
        }
    });

    server.route({
        method: 'GET',
        path: '/departments',
        handler: function (request, reply) {

            reply.models().department.find(function(err, departments) {

                if (err) throw err;

                if (!request.query.includeKml) {
                    _.each(departments, function(department) {
                        delete department.kml;
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

            reply.models().department.get(request.params.id, function(err, department) {

                if (err) throw err;

                reply(department);
            });
        }
    });

    server.route({
        method: 'GET',
        path: '/towns',
        handler: function (request, reply) {

            reply.models().town.find(function(err, towns) {

                if (err) throw err;

                if (!request.query.includeKml) {
                    _.each(towns, function(town) {
                        delete town.kml;
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

            reply.models().town.get(request.params.id, function(err, town) {

                if (err) throw err;

                reply(town);
            });
        }
    });
};