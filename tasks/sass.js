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

  // TODO: ditch this when grunt v0.4 is released
  grunt.util = grunt.util || grunt.utils;

  var path = require('path');
  var _ = grunt.util._;
  var async = grunt.util.async;

  grunt.registerMultiTask('sass', 'Compile Sass', function() {
    var helpers = require('grunt-contrib-lib').init(grunt);
    var options = helpers.options(this);
    var cb = this.async();
    var args = ['--stdin'];

    grunt.verbose.writeflags(options, 'Options');

    // TODO: ditch this when grunt v0.4 is released
    this.files = this.files || helpers.normalizeMultiTaskFiles(this.data, this.target);

    // Options -> CLI parameters
    Object.keys(options).forEach(function(el) {
      var val = '' + options[ el ];

      el = el.replace(/[A-Z]/g, function(match) {
        return '-' + match.toLowerCase();
      });

      if (val === true) {
        args.push('--' + el);
      }

      if (_.isString(val)) {
        args.push('--' + el, val);
      }

      if (_.isNumber(val)) {
        args.push('--' + el, '' + val);
      }

      if (_.isArray(val)) {
        val.forEach(function(arrVal) {
          args.push('--' + el, arrVal);
        });
      }
    });

    async.forEachSeries(this.files, function(el, cb2) {
      var elArgs = [el.dest];
      var src = el.src;
      var files = grunt.file.expandFiles(src);
      var max = grunt.helper('concat', files);

      if (path.extname(src) === '.scss') {
        elArgs.push('--scss');
      }

      // Add dirs of specified files to the sass path
      files.forEach(function(el) {
        elArgs.push('--load-path', path.dirname(el));
      });

      var sass = grunt.util.spawn({
        cmd: 'sass',
        args: elArgs.concat(args)
      }, function(error, result, code) {
        cb2(code > 0);
      });

      sass.stdin.write(new Buffer(max));
      sass.stdin.end();
      sass.stdout.pipe(process.stdout);
      sass.stderr.pipe(process.stderr);
    }, function(error) {
      cb(!error);
    });
  });
};
