'use strict';
var grunt = require('grunt');

exports.sass = {
  compile: function (test) {
    test.expect(4);

    var scss = grunt.file.read('test/tmp/scss.css');
    var sass = grunt.file.read('test/tmp/sass.css');
    var css = grunt.file.read('test/tmp/css.css');
    var expected = grunt.file.read('test/expected/compile.css');

    test.equal(scss, expected, 'should compile SCSS to CSS');
    test.equal(sass, expected, 'should compile SASS to CSS');
    test.equal(css, expected, 'should compile CSS to CSS');

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
  }
};
