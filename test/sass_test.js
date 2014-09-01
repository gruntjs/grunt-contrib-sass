'use strict';
var grunt = require('grunt');

exports.sass = {
  compile: function (test) {
    test.expect(7);

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

    test.ok(!grunt.file.exists('test/tmp/_partial.css'), 'underscore partial files should be ignored');

    test.done();
  },

  update: function (test) {
    test.expect(3);

    var scss = grunt.file.read('test/tmp/updatetrue.css');
    var sass = grunt.file.read('test/tmp/updatetrue.css');
    var css = grunt.file.read('test/tmp/updatetrue.css');
    var expected = grunt.file.read('test/expected/updatetrue.css');

    test.equal(scss, expected, 'should compile SCSS to CSS');
    test.equal(sass, expected, 'should compile SASS to CSS');
    test.equal(css, expected, 'should compile CSS to CSS');

    test.done();
  },

  checkDependencies: function (test) {
    test.expect(6);

    var scss = grunt.file.read('test/tmp/dependencies/import_partial_scss.css');
    var scssExpected = grunt.file.read('test/expected/dependencies/import_partial_scss.css');
    var sass = grunt.file.read('test/tmp/dependencies/import_partial_sass.css');
    var sassExpected = grunt.file.read('test/expected/dependencies/import_partial_sass.css');
    var partialInPartial = grunt.file.read('test/tmp/dependencies/partial_two_deep.css');
    var partialInPartialExpected = grunt.file.read('test/expected/dependencies/partial_two_deep.css');
    var acrossMultipleA = grunt.file.read('test/tmp/dependencies/import_across_2_files_1-2.css');
    var acrossMultipleAExpected = grunt.file.read('test/expected/dependencies/import_across_2_files_1-2.css');
    var acrossMultipleB = grunt.file.read('test/tmp/dependencies/import_across_2_files_2-2.css');
    var acrossMultipleBExpected = grunt.file.read('test/expected/dependencies/import_across_2_files_2-2.css');

    test.equal(scss, scssExpected, 'should read SCSS partials');
    test.equal(sass, sassExpected, 'should read SASS partials');
    test.equal(partialInPartial, partialInPartialExpected, 'SASS should save properly when referenced from another partial');
    test.equal(acrossMultipleA, acrossMultipleAExpected, 'When multiple files require a partial they should all get written (1/2)');
    test.equal(acrossMultipleB, acrossMultipleBExpected, 'When multiple files require a partial they should all get written (2/2)');
    test.ok(!grunt.file.exists('test/tmp/dependencies/import_partial_css.css'), 'SASS doesn\'t handle importing *.css partials');

    test.done();
  }
};
