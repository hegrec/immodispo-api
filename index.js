var Hapi = require('hapi');
var path = require('path');
var server = new Hapi.Server();
server.connection({
    port: 3001,
    routes: {
        payload: {
            maxBytes: 1024*1024*1024*1024
        }
    }
});

var plugins = [
    require('./data'),
    require('./domain')
];

require('./routes')(server);

server.register(plugins, function (err) {
    if (err) {
        console.error('Failed to load a plugin:', err);
    }
});

server.start(function () {
    console.log('Server running at:', server.info.uri);
});