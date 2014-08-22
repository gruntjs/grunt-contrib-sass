/*
 * grunt-contrib-sass
 * http://gruntjs.com/
 *
 * Copyright (c) 2013 Sindre Sorhus, contributors
 * Licensed under the MIT license.
 */
'use strict';
var path = require('path');
var dargs = require('dargs');
var numCPUs = require('os').cpus().length || 1;
var async = require('async');
var chalk = require('chalk');
var spawn = require('win-spawn');
var which = require('which');

module.exports = function (grunt) {
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

  var getDependencies = function (needle, haystack) {
    //__ REMOVE THE NEEDLE FROM THE ARRAY OF FILES BECAUSE A FILE SHOULD NOT IMPORT ITSELF
    var index = haystack.indexOf(needle);
    var dependentFiles = [];
    var i; // used to itterate through the array of files
    haystack.splice(index, 1);

    for(i in haystack) {
      //_ DEFINE CURRENT FILE
      var curfile = haystack[i];

      var relpath = path.relative(curfile, needle); //__ GET RELATIVE PATH BETWEEN OUR CURRENT FILE AND OUR NEEDLE
      var string_to_look_in_for_import_statement = grunt.file.read(curfile);
      var import_statement_to_look_for = relpath.replace('../', '').replace('/_','/').replace(path.extname(relpath),'');
      if( import_statement_to_look_for.substr(0,1) === "_" ){
        import_statement_to_look_for = import_statement_to_look_for.replace('_','');
      }
      if(string_to_look_in_for_import_statement.indexOf(import_statement_to_look_for) !== -1){
        var ispartial = (path.basename(curfile).substr(0,1) === '_' ? true : false);
        if(ispartial){
          getDependencies(curfile,haystack);
        } else {
          if(dependentFiles.indexOf(curfile) === -1){ //__ dont repeat files in array;
            dependentFiles.push(curfile);
          }
        }
      }
    }
    return dependentFiles;
  };

  grunt.registerMultiTask('sass', 'Compile Sass to CSS', function () {
    var cb = this.async();
    var options = this.options();
    var asyncArray = this.files;
    var bundleExec = options.bundleExec;
    var banner;
    var checkDependentFiles;
    var passedArgs;

    if (bundleExec) {
      checkBinary('bundle',
        'bundleExec options set but no Bundler executable found in your PATH.'
      );
    } else {
      checkBinary('sass',
        'You need to have Ruby and Sass installed and in your PATH for this task to work.'
      );
    }

    // Unset banner option if set
    if (options.banner) {
      banner = options.banner;
      delete options.banner;
    }

    // Unset checkDependentFiles option if set
    if (options.checkDependentFiles) {
      checkDependentFiles = options.checkDependentFiles;
      delete options.checkDependentFiles;
    }

    passedArgs = dargs(options, ['bundleExec']);

    async.eachLimit(asyncArray, numCPUs, function (file, next) {
      var src = file.src[0];

      if (typeof src !== 'string') {
        src = file.orig.src[0];
      }

      // If this file is a partial...
      if (path.basename(src)[0] === '_') {
        // check if checkDependentFiles is defined
        // or if the file we're compiling is *.css
        // SASS doesn't import css files as scss or sass files -- this might be fixed with SASS 4.0;
        if (!checkDependentFiles || path.extname(src) === '.css') {
          return next();
        } else {
          // console.log(
          //   chalk.black.bgYellow.bold('THIS IS FILE INFORMATION')
          // );
          // console.log(file)
          var ext = path.extname(src);
          var globbingPattern = '**/*'+ext;
          var haystack = grunt.file.expand(globbingPattern);
          var newFilesToPush = getDependencies(src, haystack);
          for(var i in newFilesToPush){
            var newFile = newFilesToPush[i];
            console.log(
              chalk.red.bgWhite.bold('NewFile: '+newFile+'\nfile.dest: '+file.dest+'\nfile.orig.dest: '+file.orig.dest)
            );
            console.log(
              chalk.red.bgWhite.bold('path.relative: '+path.relative(file.dest,path.dirname(newFile)))
            );
            var basename = path.basename(newFile, ext) + '.css';
            var dest = path.dirname(file.dest) + '/' + basename;
            var addToAsyncArray = {
              src: [newFile],
              dest: dest,
              orig: file.orig
            };
            asyncArray.push(addToAsyncArray);
          }
          return next();
        }
      }

      if (!grunt.file.exists(src)) {
        grunt.log.warn('Source file "' + src + '" not found.');
        return next();
      }

      var args = [
        src,
        file.dest
      ].concat(passedArgs);

      if (options.update) {
        // When the source file hasn't yet been compiled SASS will write an empty file.
        // If this is the first time the file has been written we treat it as a if update was not passed
        if (!grunt.file.exists(file.dest)) {
          // Find where the --update flag is and remove it.
          var index = args.indexOf('--update');
          args.splice(index, 1);
        } else {
          // The first two elements in args is our source and destination files,
          // we use those values to build a path that SASS recognizes namely: source:destination
          var sassPath = args.shift() + ':' + args.shift();
          args.push(sassPath);
        }
      }

      var bin = 'sass';

      if (bundleExec) {
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

      cp.on('error', function (err) {
        grunt.warn(err);
      });

      cp.on('close', function (code) {
        if (code > 0) {
          return grunt.warn('Exited with error code ' + code);
        }

        // Callback to insert banner
        if (banner) {
          bannerCallback(file.dest, banner);
        }

        grunt.verbose.writeln('File ' + chalk.cyan(file.dest) + ' created.');
        next();
      });
    }, cb);
  });
};
