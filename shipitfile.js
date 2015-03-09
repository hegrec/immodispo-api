

module.exports = function (shipit) {
    require('shipit-deploy')(shipit);

    shipit.initConfig({
        default: {
            workspace: '/tmp/immodispo-api',
            deployTo: '/opt/immodispo-api',
            repositoryUrl: 'https://github.com/hegrec/immodispo-api.git',
            ignores: ['.git', 'node_modules'],
            keepReleases: 3
        },
        staging: {
            servers: 'caketoast.com'
        },
        production: {
            servers: 'apiuser@mealtrap.com'
        }
    });

    shipit.on('published', function() {
        shipit.remote('cd /opt/immodispo-api/current && npm install').then(function(res) {
            shipit.log(res);
            shipit.remote('cp /home/apiuser/env.js /opt/immodispo-api/current').then(function(res) {
                shipit.log(res);
                shipit.remote('pm2 restart all').then(function(res) {
                    shipit.log(res);
                });
            });
        });
    })
};