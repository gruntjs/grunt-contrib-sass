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

  var _ = grunt.util._;
  var helpers = require('grunt-contrib-lib').init(grunt);

  grunt.registerMultiTask('sass', '', function() {

    var helpers = require('grunt-contrib-lib').init(grunt);
    var options = helpers.options(this, {namespace: 'JST'});

    grunt.verbose.writeflags(options, 'Options');

    // TODO: ditch this when grunt v0.4 is released
    this.files = this.files || helpers.normalizeMultiTaskFiles(this.data, this.target);


  });

};
