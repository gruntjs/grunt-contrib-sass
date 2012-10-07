# grunt-contrib-sass [![Build Status](https://secure.travis-ci.org/gruntjs/grunt-contrib-sass.png?branch=master)](http://travis-ci.org/gruntjs/grunt-contrib-sass)
> Compile Sass to CSS.

## Getting Started

This task requires you to have [Ruby](http://www.ruby-lang.org/en/downloads/) and [Sass](http://sass-lang.com/download.html). If you're on OS X or Linux you probably already have it installed, try `ruby -v` in your terminal. When you've confirmed you have Ruby installed, run `gem install sass` to get Sass.

Install this grunt plugin next to your project's [grunt.js gruntfile][getting_started] with: `npm install grunt-contrib-sass`

Then add this line to your project's `grunt.js` gruntfile:

```javascript
grunt.loadNpmTasks('grunt-contrib-sass');
```

[grunt]: https://github.com/gruntjs/grunt
[getting_started]: https://github.com/gruntjs/grunt/blob/master/docs/getting_started.md


## Documentation


### Example config

```javascript
grunt.initConfig({
	sass: {										// Task
		dist: {									// Target
			files: {							// Dictionary of files
				'main.css': 'main.scss',		// 'destination': 'source'
				'widgets.css': 'widgets.scss'
			}
		},
		dev: {									// Another target
			options: {							// Target options
				style: 'expanded'
			},
			files: {
				'main.css': 'main.scss',
				'widgets.css': [
					'button.scss',
					'tab.scss',
					'debug.scss'				// Maybe you need one extra file in dev
				]
			}
		}
	}
});

grunt.loadNpmTasks('grunt-contrib-sass');

grunt.registerTask('default', 'lint sass');
```


### Example usage


#### Compile

```javascript
grunt.initConfig({
	sass: {
		files: {
			'main.css': 'main.scss'
		}
	}
});
```


#### Concat and compile

If you specify an array of `src` paths they will be concatenated. However, in most cases you would want to just `@import` them into `main.scss`.

```javascript
grunt.initConfig({
	sass: {
		files: {
			'main.css': [
				'reset.scss',
				'main.scss'
			]
		}
	}
});
```


#### Compile multiple files

You can specify multiple `destination: source` items in `files`.

```javascript
grunt.initConfig({
	sass: {
		files: {
			'main.css': 'main.scss',
			'widgets.css': 'widgets.scss'
		}
	}
});
```


### Parameters

#### files ```object```

This defines what files this task will process and should contain key:value pairs.

The key (destination) should be an unique filepath (supports [grunt.template](https://github.com/gruntjs/grunt/blob/master/docs/api_template.md)) and the value (source) should be a filepath or an array of filepaths (supports [minimatch](https://github.com/isaacs/minimatch)).

Note: When the value contains an array of multiple filepaths, the contents are concatenated in the order passed.

#### options ```object```

This controls how this task (and its helpers) operate and should contain key:value pairs, see options below.


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

--

*Task submitted by [Sindre Sorhus](http://sindresorhus.com).*