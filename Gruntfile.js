var pkg = require('./package.json');

module.exports = function (grunt) {
    /**
     * Initialize config.
     */
    grunt.initConfig({
        shipit: {
            options: {
                // Project will be build in this directory.
                workspace: '/tmp/immodispo-api',

                // Project will be deployed in this directory.
                deployTo: '/opt/immodispo-api',

                // Repository url.
                repositoryUrl: pkg.repository.url,

                // This files will not be transfered.
                ignores: ['.git', 'node_modules'],

                // Number of release to keep (for rollback).
                keepReleases: 3
            },

            // Staging environment.
            staging: {
                servers: ['mealtrap.com']
            }
        }
    });

    /**
     * Load shipit task.
     */

    grunt.loadNpmTasks('grunt-shipit');
    grunt.loadNpmTasks('shipit-deploy');
};