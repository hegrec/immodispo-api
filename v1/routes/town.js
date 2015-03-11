var util = require('../../lib/util'),
    _ = require('lodash');

module.exports = function(server) {

    server.route({
        method: 'GET',
        path: '/towns',
        config: {
            auth: 'simple',
            handler: function (request, reply) {
                var filter = util.queryToFilter(request.query);

                server.data().town.find(filter, function (err, towns) {

                    if (err) throw err;

                    reply(towns);
                });
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/towns/{id}',
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

                server.data().town.find(params, function (err, town) {

                    if (err) throw err;

                    reply(town);
                });
            }
        }
    });
}