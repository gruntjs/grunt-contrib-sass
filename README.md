# grunt-contrib-sass [![Build Status](https://secure.travis-ci.org/gruntjs/grunt-contrib-sass.png?branch=master)](http://travis-ci.org/gruntjs/grunt-contrib-sass)

> Compile Sass to CSS

_Note that this plugin has not yet been released, and only works with the latest bleeding-edge, in-development version of grunt. See the [When will I be able to use in-development feature 'X'?](https://github.com/gruntjs/grunt/blob/devel/docs/faq.md#when-will-i-be-able-to-use-in-development-feature-x) FAQ entry for more information._

## Getting Started
_If you haven't used [grunt][] before, be sure to check out the [Getting Started][] guide._

From the same directory as your project's [Gruntfile][Getting Started] and [package.json][], install this plugin with the following command:

```bash
npm install grunt-contrib-sass --save-dev
```

Once that's done, add this line to your project's Gruntfile:

```js
grunt.loadNpmTasks('grunt-contrib-sass');
```

If the plugin has been installed correctly, running `grunt --help` at the command line should list the newly-installed plugin's task or tasks. In addition, the plugin should be listed in package.json as a `devDependency`, which ensures that it will be installed whenever the `npm install` command is run.

[grunt]: http://gruntjs.com/
[Getting Started]: https://github.com/gruntjs/grunt/blob/devel/docs/getting_started.md
[package.json]: https://npmjs.org/doc/json.html


## The sass task

This task requires you to have [Ruby](http://www.ruby-lang.org/en/downloads/) and [Sass](http://sass-lang.com/download.html). If you're on OS X or Linux you probably already have Ruby installed, try `ruby -v` in your terminal. When you've confirmed you have Ruby installed, run `gem install sass` to install Sass.

### Options

#### trace ```boolean```

Show a full traceback on error.

#### unixNewlines ```boolean```

Force Unix newlines in written files.

#### check ```boolean```

Just check syntax, don't evaluate.

#### style ```string```

Output style. Can be `nested` (default), `compact`, `compressed`, or `expanded`.

#### precision ```number```

How many digits of precision to use when outputting decimal numbers. Defaults to 3.

#### quiet ```boolean```

Silence warnings and status messages during compilation.

#### compass ```boolean```

Make Compass imports available and load project configuration.

#### debugInfo ```boolean```

Emit extra information in the generated CSS that can be used by the FireSass Firebug plugin.

#### lineNumbers ```boolean```

Emit comments in the generated CSS indicating the corresponding source line.

#### loadPath ```string|array```

Add a (or multiple) Sass import path.

#### require ```string|array```

Require a (or multiple) Ruby library before running Sass.

#### cacheLocation ```string```

The path to put cached Sass files. Defaults to `.sass-cache`.

#### noCache ```boolean```

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

 * 2012-11-05 - v0.2.0 - Grunt 0.4 compatibility Improve error message when Sass binary couldn't be found
 * 2012-10-12 - v0.1.3 - Rename grunt-contrib-lib dep to grunt-lib-contrib.
 * 2012-10-08 - v0.1.2 - Fix regression for darwin.
 * 2012-10-05 - v0.1.1 - Windows support.
 * 2012-09-24 - v0.1.0 - Initial release.

--
Task submitted by <a href="http://github.com/sindresorhus">Sindre Sorhus</a>.

*Generated on Mon Nov 05 2012 18:12:24.*
