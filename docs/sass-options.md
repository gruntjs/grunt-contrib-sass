# Options

## embedSources

Type: `Boolean`  
Default: `false`

Embed source file contents in source maps.


## embedSourceMap

Type: `Boolean`  
Default: `false`

Embed source map contents in CSS.


## loadPath

Type: `String|Array<string>`  
Default: `[]`

A path, or multiple paths, to use when resolving `@imports`.


## quite

Type: `Boolean`  
Default: `false`

Whether warnings should (`false`) or should not (`true`) be printed.

## sourceMap

Type: `String`  
Default: `true`

Whether to generate source maps.


## sourceMapUrls

Type: `string`  
Default: `relative`

Values:
- `relative` - uses relative paths
- `absolute` - uses absolute paths

How to link from source maps to source files.


## style

Type: `String`  
Default: `expanded`

Values
- `expanded` - with line breaks and indentation
- `condensed` - without line breaks and indentation

Output style.


## update

Type: `Boolean`  
Default: `false`

Only compile out-of-date stylesheets.
