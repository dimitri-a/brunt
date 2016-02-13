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
        },
        jshint: {
            beforeconcat: ['client/app/**/*.js'],
            afterconcat: ['generated/js/total.js']
        },
        uglify: {
            options: {
                mangle: false
            },
            my_target: {
                files: {
                    'generated/js/total.min.js': ['generated/js/total.js']
                }
            }
        }

    }

    // initialize task config (above)
    grunt.initConfig(config);

    // load node packages that are grunt plugins
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Note for the reader: concatentation is an alternative to require.js or common.js
    // concatentation is for small to medium stuff...be pragmatic.

    // a default task (so you don't have to specify one at the CLI); watch should be last.
    grunt.registerTask('default', ['concat','uglify']);

    //TODO: Unit tests, JS LINT, other.z
};