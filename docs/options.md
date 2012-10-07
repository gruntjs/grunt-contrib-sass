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