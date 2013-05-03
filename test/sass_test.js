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
  },
  concat: function(test) {
    'use strict';
    test.expect(3);

    var css = grunt.file.read('tmp/concat.css');
    test.ok(css.match(/concat_css/), 'CSS was concatenated');
    test.ok(css.match(/concat_sass/), 'SASS was concatenated');
    test.ok(css.match(/concat_scss/), 'SCSS was concatenated');

    test.done();
  },
  debugInfo: function(test) {
    'use strict';
    test.expect(1);

    var css = grunt.file.read('tmp/debuginfo.css');
    test.ok(css.match(/@media -sass-debug-info\{filename\{.+\}line\{.+\}\}/), 'should contains debuginfo in CSS');

    test.done();
  }
};
