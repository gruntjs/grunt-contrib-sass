/*
 * grunt-contrib-sass
 * http://gruntjs.com/
 *
 * Copyright (c) 2013 Sindre Sorhus, contributors
 * Licensed under the MIT license.
 */
 'use strict';
 var path = require('path');
 var fs = require('fs');
 var dargs = require('dargs');
 var numCPUs = require('os').cpus().length || 1;
 var async = require('async');
 var chalk = require('chalk');
 var spawn = require('win-spawn');
 var which = require('which');
 var timer = require("grunt-timer");

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

  var readFile = function (file) {
    // console.log('FILLLLE');
    console.log(file);
    fs.readFileSync(file, {encoding: 'utf8'}, function (err, data) {
      console.log(data);
      console.log("FS!");
      return data;
    });
  }

  var getDependencies = function (needle, haystack) {
    grunt.verbose.writeln('Checking if: ' + chalk.cyan(path.basename(needle)) + ' has dependencies');

    // Remove the needle from the array of files because files cannot (should not) import themselves
    var index = haystack.indexOf(needle);
    haystack.splice(index, 1);
    var dependentFiles = [];
    var i;

    // We then loop through the haystack of files, determine the relative path between our current file and the needle
    // Create a string based on the relative path removing the first `../` (this takes the file out of the CWD)
    // And taking off any references to the file being a partial.
    // We make a check for the file being in the same directory as the curfile & being a partial, removing the _ from that if it's true.
    // Next we check if the file curfile is a partial (in this instance you would have  something like a colors partial that is imported into a bootstrap file)
    // If it's a partial we restart the process, if not
    // We add the file to the dependentFiles variable if is not already in the array.
    // return the array to whomever called it.
    for(i in haystack) {
      var curfile = haystack[i];
      var relpath = path.relative(curfile, needle);
      var string_to_look_in_for_import_statement = fs.readFileSync(curfile, {encoding: 'utf8'});
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
    if (dependentFiles.length > 0) {
      grunt.verbose.writeln('Files dependent on ' + chalk.cyan(needle) + ' are ' + chalk.cyan(dependentFiles));
    }
    return dependentFiles;
}

  var checkFiles = function (files, options, cb) {
    var failCount = 0;
    var filesToCheck = files.filter(function (src) {
      return path.basename(src)[0] !== '_' && grunt.file.exists(src);
    });

    async.eachLimit(filesToCheck, numCPUs, function (src, next) {
      var bin;
      var args;

      if (options.bundleExec) {
        bin = 'bundle';
        args = ['exec', 'sass', '--check', src];
      } else {
        bin = 'sass';
        args = ['--check', src];
      }

      grunt.verbose.writeln('Command: ' + bin + ' ' + args.join(' '));

      grunt.verbose.writeln('Checking file ' + chalk.cyan(src) + ' syntax.');
      spawn(bin, args, { stdio: 'inherit' })
        .on('error', grunt.warn)
        .on('close', function (code) {
          if (code > 0) {
            failCount++;
            grunt.log.error('Checking file ' + chalk.cyan(src) + ' - ' + chalk.red('failed') + '.');
          } else {
            grunt.verbose.ok('Checking file ' + chalk.cyan(src) + ' - ' + chalk.green('passed') + '.');
          }

          next();
        });
    }, function () {
      if (failCount > 0) {
        grunt.warn('Sass check failed for ' + failCount + ' files.');
      } else {
        grunt.log.ok('All ' + chalk.cyan(filesToCheck.length) + ' files passed.');
      }

      cb();
    });
  };

  grunt.registerMultiTask('sass', 'Compile Sass to CSS', function () {

    var cb = this.async();
    var options = this.options();
    var asyncArray = this.files; // Define the files sent in as a variable.
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

    if (options.check) {
      checkFiles(this.filesSrc, options, cb);
      return;
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

      // If this file is a partial
      if (path.basename(src)[0] === '_') {
        // since this is a partial we check if checkDependentFiles is true or not and then move forward
        // If checkDependentFiles is true we get the file extension from the source
        // Set a globbing pattern based on the CWD using our file extension
        // We create an array ('haystack') of files to search through.
        // Declare a variable newFilesToPush with the function getDependencies passing in the needle (src) and haystack.
        // We loop through that array and build an object (addToAsyncArray) and push that to asyncArray.
        // A new object is put in the array called "fileCalledFrom" -- this could be used for some sort of trace.
        if (checkDependentFiles) {
          var fileExtenstion = path.extname(src);
          var globbingPattern = ['**/*'+fileExtenstion, '!node_modules/**'];
          var haystack = grunt.file.expand(globbingPattern);
          var newFilesToPush = getDependencies(src, haystack);
          for(var i in newFilesToPush){
            var newFile = newFilesToPush[i];
            var dest = file.dest;
            if(file.orig.expand) {
              var basename = path.basename(newFile, fileExtenstion) + '.css';
              var expandPath = (file.orig.dest!==undefined ? file.orig.dest : process.cwd());
              dest = expandPath+'/'+basename;
            }
            var addToAsyncArray = {
              src: [newFile],
              dest: dest,
              orig: file.orig,
              fileCalledFrom: src
            };
            asyncArray.push(addToAsyncArray);
          }
        }

        // Since we are still in a partial we need to goto the next file.
        return next();
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
