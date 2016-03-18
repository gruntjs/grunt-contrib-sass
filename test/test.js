'use strict';

var grunt = require('grunt');

function readFile(file) {
  var contents = grunt.file.read(file);
  if (process.platform === 'win32') {
    contents = contents.replace(/\r\n/g, '\n');
  }
  return contents;
}

exports.sass = {
  compile: function (test) {
    test.expect(4);

    var scss = readFile('test/tmp/scss.css');
    var sass = readFile('test/tmp/sass.css');
    var css = readFile('test/tmp/css.css');
    var expected = readFile('test/expected/compile.css');

    test.equal(scss, expected, 'should compile SCSS to CSS');
    test.equal(sass, expected, 'should compile SASS to CSS');
    test.equal(css, expected, 'should compile CSS to CSS');

    test.ok(!grunt.file.exists('test/tmp/_partial.css'), 'underscore partial files should be ignored');

    test.done();
  },

  update: function (test) {
    test.expect(3);

    var scss = readFile('test/tmp/updatetrue.css');
    var sass = readFile('test/tmp/updatetrue.css');
    var css = readFile('test/tmp/updatetrue.css');
    var expected = readFile('test/expected/updatetrue.css');

    test.equal(scss, expected, 'should compile SCSS to CSS');
    test.equal(sass, expected, 'should compile SASS to CSS');
    test.equal(css, expected, 'should compile CSS to CSS');

    test.done();
  }
};
