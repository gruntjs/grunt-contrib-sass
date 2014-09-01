'use strict';

var path = require('path');
var os = require('os');
var dargs = require('dargs');
var async = require('async');
var chalk = require('chalk');
var spawn = require('win-spawn');
var which = require('which');
var checkFilesSyntax = require('./lib/check');
var dependsOn = require('sass-get-dependencies');
var timer = require("grunt-timer");
var concurrencyCount = (os.cpus().length || 1) * 2;


module.exports = function (grunt) {
  timer.init(grunt);
  var bannerCallback = function (filename, banner) {
    grunt.verbose.writeln('Writing CSS banner for ' + filename);
    grunt.file.write(filename, banner + grunt.util.linefeed + grunt.file.read(filename));
  };

  var checkBinary = function (cmd, errMess) {
    try {
      which.sync(cmd);
    } catch (err) {
      return grunt.warn(
        '\n' + errMess + '\n' +
        'More info: https://github.com/gruntjs/grunt-contrib-sass\n'
      );
    }
  };

  grunt.registerMultiTask('sass', 'Compile Sass to CSS', function () {
    var cb = this.async();
    var options = this.options();
    var asyncArray = this.files;
    var passedArgs;

    if (options.bundleExec) {
      checkBinary('bundle',
        'bundleExec options set but no Bundler executable found in your PATH.'
      );
    } else {
      checkBinary('sass',
        'You need to have Ruby and Sass installed and in your PATH for this task to work.'
      );
    }

    if (options.check) {
      options.concurrencyCount = concurrencyCount;
      checkFilesSyntax(this.filesSrc, options, cb);
      return;
    }

    passedArgs = dargs(options, ['bundleExec', 'banner', 'compileDependencies']);

    async.eachLimit(asyncArray, concurrencyCount, function (file, next) {
      var src = file.src[0];

      if (typeof src !== 'string') {
        src = file.orig.src[0];
      }

      if (!grunt.file.exists(src)) {
        grunt.log.warn('Source file "' + src + '" not found.');
        return next();
      }
      if (path.basename(src)[0] === '_') {
        if (options.compileDependencies) {
          var dependencies = dependsOn(src);
          var addToAsyncArray;
          dependencies.forEach(function (cur, index, dependencies) {
            var ext = path.extname(cur);
            var dest = path.normalize(file.orig.dest, file.orig.cwd) + "/" + path.basename(cur, ext) + ".css";
            addToAsyncArray = {
              src: [cur],
              dest: dest,
              orig: file.orig
            };
            asyncArray.push(addToAsyncArray);
          });
        }
        return next();
      }

      var args = [
        src,
        file.dest
      ].concat(passedArgs);

      if (options.update) {
        // When the source file hasn't yet been compiled SASS will write an empty file.
        // If this is the first time the file has been written we treat it as if `update` was not passed
        if (!grunt.file.exists(file.dest)) {
          // Find where the --update flag is and remove it
          args.splice(args.indexOf('--update'), 1);
        } else {
          // The first two elements in args are the source and destination files,
          // which are used to build a path that SASS recognizes, i.e. "source:destination"
          args.push(args.shift() + ':' + args.shift());
        }
      }

      var bin = 'sass';

      if (options.bundleExec) {
        bin = 'bundle';
        args.unshift('exec', 'sass');
      }

      // If we're compiling scss or css files
      if (path.extname(src) === '.css') {
        args.push('--scss');
      }

      // Make sure grunt creates the destination folders if they don't exist
      if (!grunt.file.exists(file.dest)) {
        grunt.file.write(file.dest, '');
      }

      grunt.verbose.writeln('Command: ' + bin + ' ' + args.join(' '));

      var cp = spawn(bin, args, {stdio: 'inherit'});

      cp.on('error', grunt.warn);
      cp.on('close', function (code) {
        if (code > 0) {
          return grunt.warn('Exited with error code ' + code);
        }

        // Callback to insert banner
        if (options.banner) {
          bannerCallback(file.dest, options.banner);
        }

        grunt.verbose.writeln('File ' + chalk.cyan(file.dest) + ' created.');
        next();
      });
    }, cb);
  });
};
