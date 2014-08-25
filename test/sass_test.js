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

  checkDependentFiles: function (test) {
    test.expect(6);

    var import_scss = grunt.file.read('test/tmp/import_partial_scss.css');
    var import_sass = grunt.file.read('test/tmp/import_partial_sass.css');
    var import_scss_nocwd = grunt.file.read('test/tmp/import_partial_noCwd_scss.css');
    var import_sass_nocwd = grunt.file.read('test/tmp/import_partial_noCwd_sass.css');

    var import_scss_expected = grunt.file.read('test/expected/import_partial_scss.css');
    var import_sass_expected = grunt.file.read('test/expected/import_partial_sass.css');
    var import_scss_nocwd_expected = grunt.file.read('test/expected/import_partial_noCwd_scss.css');
    var import_sass_nocwd_expected = grunt.file.read('test/expected/import_partial_noCwd_sass.css');

    test.equal(import_scss, import_scss_expected, 'SCSS Partial should export SCSS');
    test.equal(import_sass, import_sass_expected, 'SASS Partial should export SASS');
    test.equal(import_scss_nocwd, import_scss_nocwd_expected, 'SCSS partial without current working direction should export SCSS');
    test.equal(import_sass_nocwd, import_sass_nocwd_expected, 'SASS partial without current working direction should export SASS');
    test.ok(!grunt.file.exists('test/tmp/import_partial_noCwd_css.css'), 'SASS does not import *.css partials, so this should not be created');
    test.ok(!grunt.file.exists('test/tmp/import_partial_css.css'), 'SASS does not import *.css partials, so this should not be created');

    test.done();
  }
};
