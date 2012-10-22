/*
 * grunt-contrib-sass
 * http://gruntjs.com/
 *
 * Copyright (c) 2012 Sindre Sorhus, contributors
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
  var path = require('path');
  var async = grunt.util.async;

  grunt.registerMultiTask('sass', 'Compile Sass to CSS', function() {
    var helpers = require('grunt-lib-contrib').init(grunt);
    var options = this.options();
    var cb = this.async();
    var args = ['--stdin'].concat(helpers.optsToArgs(options));

    grunt.verbose.writeflags(options, 'Options');

    async.forEachSeries(this.files, function(el, cb2) {
      var elArgs = [el.dest];
      var src = el.src;
      var files = grunt.file.expandFiles(src);
      var max = files.map(function(filepath) {
        return grunt.file.read(filepath);
      }).join('\n');

      if (path.extname(src) === '.scss') {
        elArgs.push('--scss');
      }

      // Make sure grunt creates the destination folders
      grunt.file.write(el.dest, '');

      // Add dirs of specified files to the sass path
      files.forEach(function(el) {
        elArgs.push('--load-path', path.dirname(el));
      });

      var sass = grunt.util.spawn({
        cmd: process.platform === 'win32' ? 'sass.bat' : 'sass',
        args: elArgs.concat(args)
      }, function(error, result, code) {
        if (code === 127) {
          return grunt.warn(
            'You need to have Ruby and Sass installed and in your PATH for ' +
            'this task to work. More info: ' +
            'https://github.com/gruntjs/grunt-contrib-sass'
          );
        }
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
