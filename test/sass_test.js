var grunt = require('grunt');

exports.sass = {
  compile: function(test) {
    'use strict';
    test.expect(3);

    var scss = grunt.file.read('tmp/scss.css');
    var sass = grunt.file.read('tmp/sass.css');
    var css = grunt.file.read('tmp/css.css');
    var expected = grunt.file.read('test/expected/compile.css');
    test.equal(scss, expected, 'should compile SCSS to CSS');
    test.equal(sass, expected, 'should compile SASS to CSS');
    test.equal(css, expected, 'should compile CSS to CSS');

    test.done();
  }
};
