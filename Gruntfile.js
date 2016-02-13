module.exports = function(grunt) {

    //task configurations
    var config = {
        concat: {
            app: {
                dest: "generated/js/total.js",
                src: [
                    "vendor/js/test.js",
                    "js/main.js",
                    "js/config/**/*.js",
                    "js/data/**/*.js",
                    "js/services/**/*.js",
                    "js/**/*.js"
                ]
            }
        },
        less: {
            // every task can have an options object, it can live in children too (like for an override)
            app: {
                dest: "generated/css/style.css",
                src: "css/style.less"
            },
            options: {
                paths: ["css"],
                ieCompat: true
            }
        },
        // we have two workflows, one for JS, and another for CSS
        watch: {
            // notice how watch.app.files (below) self-references concat.app.src (above)
            // what this does: when a change occurs in any file in that list, it runs the concat task.
            js: {
                files: ["<%= concat.app.src %>"],
                tasks: ["concat"]
            },
            css: {
                files: ["<%= less.app.src %>"],
                tasks: ["less"]
            }
        },
        jshint: {
            files: ['Gruntfile.js', 'generated/js/total.js'],
            options: {

            }
        }
    }

    // initialize task config (above)
    grunt.initConfig(config);

    // load local tasks from the tasks folder
    //grunt.loadTasks("tasks");

    // load node packages that are grunt plugins
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    // Note for the reader: concatentation is an alternative to require.js or common.js
    // concatentation is for small to medium stuff...be pragmatic.

    // a default task (so you don't have to specify one at the CLI); watch should be last.
    grunt.registerTask('default', ['concat']);

    //TODO: Unit tests, JS LINT, other.z
};