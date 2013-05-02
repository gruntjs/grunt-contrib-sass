/*
 * grunt-contrib-sass
 * http://gruntjs.com/
 *
 * Copyright (c) 2012 Sindre Sorhus, contributors
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
  var path = require('path'),
      dargs = require('dargs');

  grunt.registerMultiTask('sass', 'Compile Sass to CSS', function () {
    var options = this.options(),
        filteredOptions = dargs(options, ['bundleExec', 'tmpDir']),
        cmd = [process.platform === 'win32' ? 'sass.bat' : 'sass'],
        tmpDir = options.tmpDir || 'tmp/',
        done = this.async();

    grunt.log.warn(filteredOptions);

    if (options.bundleExec) {
      cmd.unshift('bundle', 'exec');
    }

    grunt.verbose.writeflags(options, 'Options');

    function concat(files, dest) {
      grunt.file.write(dest, files.map(function (filepath) {
        return grunt.file.read(filepath);
      }).join(grunt.util.normalizelf(grunt.util.linefeed)));
    }

    function iterator(files, next) {
      var tasks = [],
          tmpNames = [];

      files.src.forEach(function (filepath) {

        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return;
        }

        var args = [],
            extension = path.extname(filepath),
            //tmpFile = tmpDir + filepath.split('/').join('_') + '.css';
            tmpFile = tmpDir + grunt.util._.uniqueId('tmp_') + '.css';

        tmpNames.push(tmpFile);

        if (extension === '.scss' || extension === '.css') {
          args.push('--scss');
        }

        args.push('--load-path', path.dirname(filepath));

        tasks.push(function (callback) {
          grunt.util.spawn({
            cmd: cmd[0],
            args: [].concat(cmd.slice(1), [filepath, tmpFile], args, filteredOptions)
          }, function (error, result, code) {
            if (code === 127) {
              return grunt.warn(
                  'You need to have Ruby and Sass installed and in your PATH for\n' +
                      'this task to work. More info:\n' +
                      'https://github.com/gruntjs/grunt-contrib-sass'
              );
            }
            callback(error);
          });
        });
      });

      grunt.util.async.parallel(tasks, function (error) {
        concat(tmpNames, files.dest);
        next(error);
      });
    }

    grunt.util.async.forEachSeries(this.files, iterator, done);
  });
};
