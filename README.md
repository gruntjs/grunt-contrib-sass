# grunt-contrib-sass [![Build Status](https://secure.travis-ci.org/gruntjs/grunt-contrib-sass.png?branch=master)](http://travis-ci.org/gruntjs/grunt-contrib-sass)

> Compile Sass to CSS


## Getting Started
If you haven't used [grunt][] before, be sure to check out the [Getting Started][] guide, as it explains how to create a [gruntfile][Getting Started] as well as install and use grunt plugins. Once you're familiar with that process, install this plugin with this command:

```shell
npm install grunt-contrib-sass --save-dev
```

[grunt]: http://gruntjs.com/
[Getting Started]: https://github.com/gruntjs/grunt/blob/devel/docs/getting_started.md


## Sass task
_Run this task with the `grunt sass` command._

This task requires you to have [Ruby](http://www.ruby-lang.org/en/downloads/) and [Sass](http://sass-lang.com/download.html). If you're on OS X or Linux you probably already have Ruby installed, try `ruby -v` in your terminal. When you've confirmed you have Ruby installed, run `gem install sass` to install Sass.

_This plugin is only compatible with Grunt `>= 0.4.0`._

### Options

#### separator
Type: `String`
Default: linefeed

Concatenated files will be joined on this string.

#### trace
Type: `Boolean`

Show a full traceback on error.

#### unixNewlines
Type: `Boolean`

Force Unix newlines in written files.

#### check
Type: `Boolean`

Just check syntax, don't evaluate.

#### style
Type: `String`

Output style. Can be `nested` (default), `compact`, `compressed`, or `expanded`.

#### precision
Type: `Number`

How many digits of precision to use when outputting decimal numbers. Defaults to 3.

#### quiet
Type: `Boolean`

Silence warnings and status messages during compilation.

#### compass
Type: `Boolean`

Make Compass imports available and load project configuration.

#### debugInfo
Type: `Boolean`

Emit extra information in the generated CSS that can be used by the FireSass Firebug plugin.

#### lineNumbers
Type: `Boolean`

Emit comments in the generated CSS indicating the corresponding source line.

#### loadPath
Type: `String|Array`

Add a (or multiple) Sass import path.

#### require
Type: `String|Array`

Require a (or multiple) Ruby library before running Sass.

#### cacheLocation
Type: `String`

The path to put cached Sass files. Defaults to `.sass-cache`.

#### noCache
Type: `Boolean`

Don't cache to sassc files.

### Examples

#### Example config

```javascript
grunt.initConfig({
  sass: {                              // Task
    dist: {                            // Target
      files: {                         // Dictionary of files
        'main.css': 'main.scss',       // 'destination': 'source'
        'widgets.css': 'widgets.scss'
      }
    },
    dev: {                             // Another target
      options: {                       // Target options
        style: 'expanded'
      },
      files: {
        'main.css': 'main.scss',
        'widgets.css': [
          'button.scss',
          'tab.scss',
          'debug.scss'  // Maybe you need one extra file in dev
        ]
      }
    }
  }
});

grunt.loadNpmTasks('grunt-contrib-sass');

grunt.registerTask('default', ['jshint', 'sass']);
```

#### Compile

```javascript
grunt.initConfig({
  sass: {
    dist: {
      files: {
        'main.css': 'main.scss'
      }
    }
  }
});
```

#### Concat and compile

If you specify an array of `src` paths they will be concatenated. However, in most cases you would want to just `@import` them into `main.scss`.

```javascript
grunt.initConfig({
  sass: {
    dist: {
      files: {
      'main.css': [
          'reset.scss',
          'main.scss'
        ]
      }
    }
  }
});
```

#### Compile multiple files

You can specify multiple `destination: source` items in `files`.

```javascript
grunt.initConfig({
  sass: {
    dist: {
      files: {
        'main.css': 'main.scss',
        'widgets.css': 'widgets.scss'
      }
    }
  }
});
```


## Release History

 * 2013-01-08   v0.2.1rc5   Updating to work with grunt v0.4.0rc5. Switching to this.files api. Add separator option.
 * 2012-11-04   v0.2.0   Grunt 0.4 compatibility. Improve error message when Sass binary couldn't be found
 * 2012-10-11   v0.1.3   Rename grunt-contrib-lib dep to grunt-lib-contrib.
 * 2012-10-07   v0.1.2   Fix regression for darwin.
 * 2012-10-04   v0.1.1   Windows support.
 * 2012-09-23   v0.1.0   Initial release.

---

Task submitted by [Sindre Sorhus](http://github.com/sindresorhus)

*This file was generated on Thu Jan 10 2013 14:36:27.*
