# Examples

## Example config

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

## Compile

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

## Concat and compile

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

## Compile multiple files

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

#### Compile without specifying input/output file names

Instead of naming all files you want to compile, you can use the `expand` allowing you to specify a directory. More information available on the [official grunt wiki](https://github.com/gruntjs/grunt/wiki/Configuring-tasks) cf: `Building the files object dynamically`

```javascript
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
