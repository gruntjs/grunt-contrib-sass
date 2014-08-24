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

  var testingFunction = function() { return "testing"; }

  var getDependencies = function (needle, haystack) {
    // REMOVE THE NEEDLE FROM THE ARRAY OF FILES BECAUSE A FILE SHOULD NOT IMPORT ITSELF
    var index = haystack.indexOf(needle);
    var dependentFiles = [];
    var i; // Used to itterate through the array of files
    haystack.splice(index, 1);

    for(i in haystack) {
      //_ DEFINE CURRENT FILE
      var curfile = haystack[i];
      //READ FILE TEST
      grunt.verbose.writeln('curfile: '+chalk.black.bgYellow.bold(curfile));
      // Get the relative path between our current file and the needle
      var relpath = path.relative(curfile, needle);
      // var string_to_look_in_for_import_statement = grunt.file.read(curfile);
      var string_to_look_in_for_import_statement = fs.readFileSync(curfile, {encoding: 'utf8'});
      console.log(string_to_look_in_for_import_statement);
      var import_statement_to_look_for = relpath.replace('../', '').replace('/_','/').replace(path.extname(relpath),'');

      if( import_statement_to_look_for.substr(0,1) === "_" ){
        import_statement_to_look_for = import_statement_to_look_for.replace('_','');
      }
      if(string_to_look_in_for_import_statement.indexOf(import_statement_to_look_for) !== -1){
        grunt.verbose.writeln(chalk.black.bgYellow.bold('IU AM HERE'));
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
          grunt.verbose.writeln('Checking if: ' + chalk.cyan(path.basename(src)) + ' has dependencies');
          var fileExtenstion = path.extname(src);
          var globbingPattern = ['**/*'+fileExtenstion, '!node_modules/**'];
          // grunt.verbose.writeln(chalk.black.bgYellow.bold(globbingPattern));
          var haystack = grunt.file.expand(globbingPattern);
          // grunt.verbose.writeln(chalk.black.bgYellow.bold('HAYSTACK'));
          // grunt.verbose.writeln(haystack);
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
