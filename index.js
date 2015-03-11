var Hapi = require('hapi'),
    server = new Hapi.Server(),
    env = require('./env');
console.log("startin");
server.connection({
    port: env.port,
    host: env.host,
    routes: {
        payload: {
            maxBytes: 1024*1024*1024*1024
        }
    }
});

var validate = function (username, password, callback) {

    var user = env.users[username],
        isValid = false;
    if (!user) {
        return callback(null, false);
    }


    if (password === user.password) {
        isValid = true;
    }

    callback(null, isValid, { id: user.id, name: user.name });

};

var plugins = [
    require('hapi-auth-basic'),
    require('./data')
];


console.log('reg');
server.register(plugins, function (err) {
    server.auth.strategy('simple', 'basic', { validateFunc: validate });

    if (err) {
        console.error('Failed to load a plugin:', err);
    }

    server.register(require('./v1'), {
            routes: {
                prefix: '/v1'
            }
        },
        function(err) {

        }
    );

    //backwards compatibility TODO: remove after all upgrades from legacy
    server.ext('onRequest', function(request, reply) {
        if (request.url.path.indexOf('/v1') == -1) {
            if (request.url.path == '/') {
                request.setUrl('/v1');
            } else {
                request.setUrl('/v1' + request.url.path);
            }
        }

        reply.continue();
    });

    server.start(function () {
        console.log('Server running at:', server.info.uri);
    });
});


