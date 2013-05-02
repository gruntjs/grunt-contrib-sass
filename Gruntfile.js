/*
 * grunt-contrib-sass
 * http://gruntjs.com/
 *
 * Copyright (c) 2012 Sindre Sorhus, contributors
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
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
          'tmp/sass.css': ['test/fixtures/compile.sass'],
          'tmp/scss.css': ['test/fixtures/compile.scss'],
          'tmp/css.css': ['test/fixtures/compile.css']
        }
      },
      concat: {
        files: {
          'tmp/concat.css': [
            'test/fixtures/concat.sass',
            'test/fixtures/concat.scss',
            'test/fixtures/concat.css'
          ]
        }
      },
      debugInfo: {
        options: {
          debugInfo: true
        },
        files: {
          'tmp/debuginfo.css': ['test/fixtures/compile.scss']
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-internal');

  grunt.registerTask('mkdir', grunt.file.mkdir);

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', [
    'clean',
    'mkdir:tmp',
    'sass',
    'nodeunit',
    'clean'
  ]);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test', 'build-contrib']);
};
