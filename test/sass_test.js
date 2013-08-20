'use strict';
var grunt = require('grunt');

exports.sass = {
  compile: function (test) {
    test.expect(6);

    var scss = grunt.file.read('test/tmp/scss.css');
    var sass = grunt.file.read('test/tmp/sass.css');
    var css = grunt.file.read('test/tmp/css.css');
    var expected = grunt.file.read('test/expected/compile.css');

    var scssBanner = grunt.file.read('test/tmp/sass-banner.css');
    var sassBanner = grunt.file.read('test/tmp/scss-banner.css');
    var cssBanner = grunt.file.read('test/tmp/css-banner.css');
    var expectedBanner = grunt.file.read('test/expected/compile-banner.css');

    test.equal(scss, expected, 'should compile SCSS to CSS');
    test.equal(sass, expected, 'should compile SASS to CSS');
    test.equal(css, expected, 'should compile CSS to CSS');

    test.equal(scssBanner, expectedBanner, 'should compile SCSS with a banner to CSS');
    test.equal(sassBanner, expectedBanner, 'should compile SASS with a banner to CSS');
    test.equal(sassBanner, expectedBanner, 'should compile CSS with a banner to CSS');

    test.done();
  }
};
