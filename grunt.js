/*
 * grunt-contrib-sass
 * http://gruntjs.com/
 *
 * Copyright (c) 2012 Sindre Sorhus, contributors
 * Licensed under the MIT license.
 * https://github.com/gruntjs/grunt-contrib-sass/blob/master/LICENSE-MIT
 */

module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({
    lint: {
      all: [
        'grunt.js',
        'tasks/*.js',
        '<config:nodeunit.tasks>'
      ]
    },

    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        node: true,
        es5: true
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      test: [
        'tmp',
        '.sass-cache'
      ]
    },

    // Configuration to be run (and then tested).
    sass: {
      compile: {
        files: {
          'tmp/scss.css': ['test/fixtures/compile.scss'],
          'tmp/sass.css': ['test/fixtures/compile.sass']
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tasks: ['test/*_test.js']
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // The clean plugin helps in testing.
  grunt.loadNpmTasks('grunt-contrib-clean');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.renameTask('test', 'nodeunit');
  grunt.registerTask('test', 'clean mkdir:tmp sass nodeunit clean');

  // By default, lint and run all tests.
  grunt.registerTask('default', 'lint test');

  grunt.registerTask('mkdir', function(dir) {
    require('fs').mkdirSync(dir);
  });
};
