var grunt = require('grunt');

exports.sass = {
  compile: function(test) {
    'use strict';
    test.expect(3);

    var scss = grunt.file.read('tmp/scss.css');
    var sass = grunt.file.read('tmp/sass.css');
    var expected = grunt.file.read('test/expected/compile.css');
    test.equal(scss, expected, 'should compile SCSS to CSS');
    test.equal(sass, expected, 'should compile SASS to CSS');

    var sass_debuginfo = grunt.file.read('tmp/scss_debuginfo.css');
    var containsFilename = new RegExp('@media -sass-debug-info{filename{.+}line');
    test.ok(sass_debuginfo.match(containsFilename), 'should contain filename for debuginfo in CSS');

    test.done();
  }
};
