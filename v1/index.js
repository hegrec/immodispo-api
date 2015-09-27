
exports.register = function (server, options, next) {
    require('./routes/region')(server);
    require('./routes/department')(server);
    require('./routes/town')(server);
    require('./routes/agency')(server);
    require('./routes/listing')(server);


    server.route({
        method: 'GET',
        path: '/',
        config: {
            handler: function (request, reply) {
                var indexResponse = {
                    body: "Welcome to the Immodispo API v1. Please see the documentation at http://www.coinerd.com/docs/api"
                };

                reply(indexResponse);
            }
        }
    });
};

exports.register.attributes = {
    name: 'v1_routes',
    version: '1.0.0'
};
