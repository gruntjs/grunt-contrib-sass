'use strict';
module.exports = function (grunt) {
  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        'tasks/**/*.js',
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
      tests: ['test/test.js']
    },
    sass: {
      options: {
        sourcemap: 'none'
      },
      compile: {
        files: {
          'test/tmp/scss.css': 'test/fixtures/compile.scss',
          'test/tmp/sass.css': 'test/fixtures/compile.sass',
          'test/tmp/css.css': 'test/fixtures/compile.css'
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
          src: [
            'updatetrue.scss',
            'updatetrue.sass',
            'updatetrue.css'
          ],
          dest: 'test/tmp',
          ext: '.css'
        }]
      }
    }
  });

  grunt.loadTasks('tasks');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-internal');

  grunt.registerTask('test', [
    'clean',
    'jshint',
    'sass',
    'nodeunit',
    'clean'
  ]);
  grunt.registerTask('default', ['test', 'contrib-core', 'contrib-ci:skipIfExists']);
};
