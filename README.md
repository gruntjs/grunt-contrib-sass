# grunt-contrib-sass v2.0.0 [![Build Status: Linux](https://travis-ci.org/gruntjs/grunt-contrib-sass.svg?branch=master)](https://travis-ci.org/gruntjs/grunt-contrib-sass) [![Build Status: Windows](https://ci.appveyor.com/api/projects/status/ugf9aop97slt5anb/branch/master?svg=true)](https://ci.appveyor.com/project/gruntjs/grunt-contrib-sass/branch/master)

> Compile Sass to CSS



## Getting Started

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-contrib-sass --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-contrib-sass');
```




## Sass task
_Run this task with the `grunt sass` command._

[Sass](http://sass-lang.com) is a preprocessor that adds nested rules, variables, mixins and functions, selector inheritance, and more to CSS. Sass files compile into well-formatted, standard CSS to use in your site or application.

This task requires you to have [Dart Sass](http://sass-lang.com/install) installed and for Dart Sass to be added into your system's `PATH`. Refer to the links for an installation guide on this dependency. To confirm you've installed Dart Sass, run `sass --version` and make sure it only displays a version number `>= 1.5.0` **without** a version name (if you are using any other version of Sass other than Dart Sass, then the version name will proceed the version number, e.g. `Ruby Sass x.x.x`).

Note: Files that begin with "_" are ignored even if they match the globbing pattern. This is done to match the expected [Sass partial behaviour](http://sass-lang.com/documentation/file.SASS_REFERENCE.html#partials).

> [Ruby Sass](https://sass-lang.com/ruby-sass) was deprecated in March 2018. It's recommended that you migrate to [Dart Sass](https://sass-lang.com/dart-sass), but for anyone still using Ruby Sass, use `npm install grunt-contrib-sass@1.0.0 --save-dev` and refer back to the [README](https://github.com/gruntjs/grunt-contrib-sass/blob/4d564555ecb138108129c53a896bf03818d11e3d/README.md) for v1.0.0 instead.
### Options

#### embedSources

Type: `Boolean`  
Default: `false`

Embed source file contents in source maps.


#### embedSourceMap

Type: `Boolean`  
Default: `false`

Embed source map contents in CSS.


#### loadPath

Type: `String|Array<string>`  
Default: `[]`

A path, or multiple paths, to use when resolving `@imports`.


#### quite

Type: `Boolean`  
Default: `false`

Whether warnings should (`false`) or should not (`true`) be printed.

#### sourceMap

Type: `String`  
Default: `true`

Whether to generate source maps.


#### sourceMapUrls

Type: `string`  
Default: `relative`

Values:
- `relative` - uses relative paths
- `absolute` - uses absolute paths

How to link from source maps to source files.


#### style

Type: `String`  
Default: `expanded`

Values
- `expanded` - with line breaks and indentation
- `condensed` - without line breaks and indentation

Output style.


#### update

Type: `Boolean`  
Default: `false`

Only compile out-of-date stylesheets.

### Examples

#### Example config

```js
grunt.initConfig({
  sass: {                              // Task
    dist: {                            // Target
      options: {                       // Target options
        style: 'expanded'
      },
      files: {                         // Dictionary of files
        'main.css': 'main.scss',       // 'destination': 'source'
        'widgets.css': 'widgets.scss'
      }
    }
  }
});

grunt.loadNpmTasks('grunt-contrib-sass');

grunt.registerTask('default', ['sass']);
```

#### Compile

```js
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

Instead of concatenating the files, just `@import` them into another `.sass` file eg. `main.scss`.


#### Compile multiple files

You can specify multiple `destination: source` items in `files`.

```js
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

#### Compile files in a directory

Instead of naming all files you want to compile, you can use the `expand` property allowing you to specify a directory. More information available in the [grunt docs](http://gruntjs.com/configuring-tasks) - `Building the files object dynamically`.

```js
grunt.initConfig({
  sass: {
    dist: {
      files: [{
        expand: true,
        cwd: 'styles',
        src: ['*.scss'],
        dest: '../public',
        ext: '.css'
      }]
    }
  }
});
```


## Release History

 * 2018-06-06   v2.0.0   Upgrade to Dart Sass 1.5.0 (deprecate Ruby Sass).
 * 2016-03-04   v1.0.0   Bump `chalk`. Update to docs and project structure.
 * 2015-02-06   v0.9.0   Remove `banner` option. Allow using `--force` to ignore compile errors. Increase concurrency count from `2` to `4`. Improve Windows support.
 * 2014-08-24   v0.8.1   Fix `check` option.
 * 2014-08-21   v0.8.0   Support Sass 3.4 Source Map option. Add `update` option.
 * 2014-08-09   v0.7.4   Fix `bundleExec` option. Fix `os.cpus()` issue. Log `sass` command when `--verbose` flag is set.
 * 2014-03-06   v0.7.3   Only create empty dest files when they don't already exist.
 * 2014-02-02   v0.7.2   Fix error reporting when Sass is not available.
 * 2014-01-28   v0.7.1   Fix regression of Bundler support.
 * 2014-01-26   v0.7.0   Improve Windows support.
 * 2013-12-10   v0.6.0   Ignore files where filename have leading underscore.
 * 2013-08-21   v0.5.0   Add `banner` option.
 * 2013-07-06   v0.4.1   Use `file.orig.src` if `file.src` does not exist and return early to avoid passing non-existent files to sass binary.
 * 2013-06-30   v0.4.0   Rewrite task to be able to support Source Maps. Compile Sass files in parallel for better performance.
 * 2013-03-26   v0.3.0   Add support for `bundle exec`. Make sure `.css` files are compiled with SCSS.
 * 2013-02-15   v0.2.2   First official release for Grunt 0.4.0.
 * 2013-01-25   v0.2.2rc7   Updating grunt/gruntplugin dependencies to rc7. Changing in-development grunt/gruntplugin dependency versions from tilde version ranges to specific versions.
 * 2013-01-09   v0.2.2rc5   Updating to work with grunt v0.4.0rc5. Switching to `this.files` API. Add `separator` option.
 * 2012-11-05   v0.2.0   Grunt 0.4 compatibility. Improve error message when Sass binary couldn't be found
 * 2012-10-12   v0.1.3   Rename grunt-contrib-lib dep to grunt-lib-contrib.
 * 2012-10-08   v0.1.2   Fix regression for darwin.
 * 2012-10-05   v0.1.1   Windows support.
 * 2012-09-24   v0.1.0   Initial release.

---

Task submitted by [Sindre Sorhus](https://github.com/sindresorhus)

*This file was generated on Thu Jun 07 2018 09:11:10.*
