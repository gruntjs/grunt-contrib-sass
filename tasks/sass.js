'use strict';

const path = require('path');
const os = require('os');
const dargs = require('dargs');
const async = require('async');
const chalk = require('chalk');
const spawn = require('cross-spawn');
const which = require('which');
const concurrencyCount = (os.cpus().length || 1) * 4;
const {StringDecoder} = require('string_decoder');
const decoder = new StringDecoder('utf8');
const semver = require('semver');

module.exports = function (grunt) {
  
  // Define Sass version info.
  const VERSION_INVALIDS = [
    'ruby',
    'libass'
  ];
  const VERSION_MIN = '1.5.0';
  
  // Initialize helpers.
  const checkBinaryExists = function (cmd) {
    
    try { which.sync(cmd); } catch(error) { throw error; }
    
  };
  const checkBinaryVersion = function(cmd) {
    
    try {
      
      let version = decoder.write(spawn.sync(cmd, ['--version']).stdout).toLowerCase();
  
      const passing = VERSION_INVALIDS.map((name) => version.indexOf(name) === -1).every((result) => result === true); 
      
      const minimum = semver.satisfies(semver.valid(semver.coerce(version)), `>=${VERSION_MIN}`);
 
      if( !passing || !minimum ) { throw new Error('Invalid Sass version.'); }
      
    } catch(error) { throw error; }
    
  };
  const checkBinary = function(cmd, msg) {
    
    try {
      
      checkBinaryExists(cmd);
      
      checkBinaryVersion(cmd);
        
    } catch(error) {
      
      return grunt.warn(`\n${msg}\nMore info: https://github.com/gruntjs/grunt-contrib-sass\n`);
      
    }
    
  };

  grunt.registerMultiTask('sass', 'Compile Sass to CSS', function () {
    
    const done = this.async();
    const options = this.options();

    checkBinary('sass', 'You need to have Dart Sass installed and in your PATH for this task to work.');

    const passedArgs = dargs(options, {});

    async.eachLimit(this.files, concurrencyCount, function (file, next) {
      
      const [src] = file.src;

      if (path.basename(src)[0] === '_') { return next(); }

      const args = [src, file.dest].concat(passedArgs);

      if ( options.update ) {
        
        // When the source file hasn't yet been compiled Sass will write an empty file.
        // If this is the first time the file has been written we treat it as if `update` was not passed.
        if ( !grunt.file.exists(file.dest) ) {
          
          // Find where the --update flag is and remove it
          args.splice(args.indexOf('--update'), 1);
          
        } else {
          
          // The first two elements in args are the source and destination files,
          // which are used to build a path that Sass recognizes, i.e. "source:destination"
          args.push(args.shift() + ':' + args.shift());
          
        }
        
      }

      const bin = 'sass';

      // Make sure grunt creates the destination folders if they don't exist
      if (!grunt.file.exists(file.dest)) { grunt.file.write(file.dest, ''); }

      grunt.verbose.writeln('Command: ' + bin + ' ' + args.join(' '));

      var cp = spawn(bin, args, {stdio: 'inherit'});

      cp.on('error', grunt.warn);

      cp.on('close', function (code) {
        
        if (code > 0) { 
          
          grunt.warn('Exited with error code ' + code);
          
          next();
          
          return;
          
        }

        grunt.verbose.writeln('File ' + chalk.cyan(file.dest) + ' created');
        
        next();
        
      });
      
    }, done);
    
  });
  
};
