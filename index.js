var Hapi = require('hapi'),
    server = new Hapi.Server(),
    env = require('./env'),
    users = {
        web: {
            username: 'web',
            password: env.WEB_SECRET,
            name: 'Web Application',
            id: 1
        },
        crawl: {
            username: 'crawl',
            password: env.CRAWL_SECRET,
            name: 'Crawl Application',
            id: 1
        },
        admin: {
            username: 'crawl',
            password: env.CRAWL_SECRET,
            name: 'Crawl Application',
            id: 1
        }
    };

server.connection({
    port: 3001,
    //host: '127.0.0.1',
    routes: {
        payload: {
            maxBytes: 1024*1024*1024*1024
        }
    }
});

var validate = function (username, password, callback) {

    var user = users[username],
        isValid = false;
    if (!user) {
        return callback(null, false);
    }


    if (password === 'qgvh567^') {
        isValid = true;
    }

    callback(null, isValid, { id: user.id, name: user.name });

};

var plugins = [
    require('hapi-auth-basic'),
    require('./data')
];



server.register(plugins, function (err) {

    server.auth.strategy('simple', 'basic', { validateFunc: validate });

    if (err) {
        console.error('Failed to load a plugin:', err);
    }

    server.ext('onRequest', function(request, reply) {


        console.log(request.url.href, request.method);
        reply.continue();
    });

    require('./routes')(server);

    server.start(function () {
        console.log('Server running at:', server.info.uri);
    });
});


