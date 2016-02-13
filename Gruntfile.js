module.exports = function(grunt) {

    //task configurations
    var config = {
        concat: {
            app: {
                dest: "generated/js/total.js",
                src: [
                    "client/app/**/*.js"

                ]
            }
        }

    }

    // initialize task config (above)
    grunt.initConfig(config);

    // load node packages that are grunt plugins
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    // Note for the reader: concatentation is an alternative to require.js or common.js
    // concatentation is for small to medium stuff...be pragmatic.

    // a default task (so you don't have to specify one at the CLI); watch should be last.
    grunt.registerTask('default', ['concat','jshint']);

    //TODO: Unit tests, JS LINT, other.z
};