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

  grunt.registerMultiTask('sass', 'Compile Sass to CSS', function() {
    var helpers = require('grunt-lib-contrib').init(grunt);
    var options = this.options();
    var cb = this.async();
    var src = this.file.src;
    var dest = this.file.dest;

    var args = helpers.optsToArgs(options);

    grunt.verbose.writeflags(options, 'Options');

    if (path.extname(src) === '.scss') {
      args.push('--scss');
    }

    // Make sure grunt creates the destination folders
    grunt.file.write(dest, '');

    // Add dirs of specified files to the sass path
    src.forEach(function(el) {
      args.push('--load-path', path.dirname(el));
    });

    var sass = grunt.util.spawn({
      cmd: process.platform === 'win32' ? 'sass.bat' : 'sass',
      args: args.concat(src).concat(dest)
    }, function(error, result, code) {
      if (code === 127) {
        return grunt.warn(
          'You need to have Ruby and Sass installed and in your PATH for ' +
          'this task to work. More info: ' +
          'https://github.com/gruntjs/grunt-contrib-sass'
        );
      }
      cb(error);
    });

  });
};
