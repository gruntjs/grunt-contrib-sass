/*
 * grunt-contrib-sass
 * http://gruntjs.com/
 *
 * Copyright (c) 2012 Sindre Sorhus, contributors
 * Licensed under the MIT license.
 */
'use strict';

module.exports = function (grunt) {
  grunt.initConfig({
    pkg: {
      name: 'grunt-contrib-sass'
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ]
    },
    clean: {
      test: [
        'test/tmp',
        '.sass-cache'
      ]
    },
    nodeunit: {
      tests: ['test/*_test.js']
    },
    sass: {
      options: {
        sourcemap: 'none'
      },
      compile: {
        files: {
          'test/tmp/scss.css': ['test/fixtures/compile.scss'],
          'test/tmp/sass.css': ['test/fixtures/compile.sass'],
          'test/tmp/css.css': ['test/fixtures/compile.css']
        }
      },
      compileBanner: {
        options: {
          banner: '/* <%= pkg.name %> banner */'
        },
        files: {
          'test/tmp/scss-banner.css': ['test/fixtures/banner.scss'],
          'test/tmp/sass-banner.css': ['test/fixtures/banner.sass'],
          'test/tmp/css-banner.css': ['test/fixtures/banner.css']
        }
      },
      ignorePartials: {
        cwd: 'test/fixtures/partials',
        src: '*.scss',
        dest: 'test/tmp',
        expand: true,
        ext: '.css'
      },
      updateTrue: {
        options: {
          update: true
        },
        files: [{
          expand: true,
          cwd: 'test/fixtures',
          src: ['updatetrue.scss', 'updatetrue.sass', 'updatetrue.css'],
          dest: 'test/tmp',
          ext: '.css'
        }]
      },
      dependentFiles: {
        options: {
          checkDependentFiles: true
        },
        files: [{
          cwd: 'test',
          src: ['**/fixtures/partials/*.scss', '**/fixtures/partials/*.sass', '**/fixtures/partials/*.css'],
          dest: 'test/tmp',
          expand: true,
          ext: '.css'
        }]
      },
      dependentFilesNoCwd: {
        options: {
          checkDependentFiles: true
        },
        files: {
          'test/tmp/import_partial-scss.css': ['test/fixtures/partials/_dependentFiles_test_scss.scss'],
          'test/tmp/import_partial-sass.css': ['test/fixtures/partials/_dependentFiles_test_sass.sass'],
          'test/tmp/import_partial-css.css': ['test/fixtures/partials/_dependentFiles_test_css.css'],
        }
      }
    }
  });

  grunt.loadTasks('tasks');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-internal');

  grunt.registerTask('mkdir', grunt.file.mkdir);
  grunt.registerTask('test', [
    'clean',
    'mkdir:tmp',
    'sass',
    'nodeunit',
    // 'clean'
  ]);
  grunt.registerTask('default', ['jshint', 'test', 'build-contrib']);
};
