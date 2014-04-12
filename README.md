# grunt-fetch-from-cdn

> This grunt plugin can fetch single file (say jquery.js) from a CDN.  Unlike bower, it fetches only a single file and not the entire project.

## Getting Started
This plugin requires Grunt `~0.4.4`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-fetch-from-cdn --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-fetch-from-cdn');
```

## The "fetchFromCDN" task

### Overview
In your project's Gruntfile, add a section named `fetchFromCDN` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  fetchFromCDN: {
        options: {
          cdnBaseUrl: 'http://cdnjs.cloudflare.com/ajax/libs',
        },
        projJsFiles: {
          dest: 'target',

          fetch: [{
            pkg: 'angular.js',
            ver: '1.2.15',
            file: 'angular.min.js'
          }, {
            pkg: 'angular-ui-calendar',
            ver: '0.8.0',
            file: 'calendar.js'
          }],

          fetchUrls: [
            'http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js'
          ]
        }
      }
});
```

### Options

#### options.cdnBaseUrl
Type: `String`
Default value: `http://cdn.jsdelivr.net`

The fetch request will go to this website.

#### options.flatten
Type: `Boolean`
Default value: `false`

When set to true, all the fetched files will be placed in one single directory without any nested sub directories.

### Task Settings

#### dest
Type: `String`
Default: `No defaults provided`

This should be a directory where you want to place all the fetched files.  This is a required settings.  The task terminates with an error message if you don't specifiy a value for this field.

#### fetch
Type: Array of Objects

This would represent the list of files you want to fetch. The details of each file - pkg, ver, file - should be mentioned as shown below.

```js
	fetch: [{
	  pkg: 'angular.js',
	  ver: '1.2.15',
	  file: 'angular.min.js'
	}, {
	  pkg: 'angular-ui-calendar',
	  ver: '0.8.0',
	  file: 'calendar.js'
	}]
```

The plugin will use the details to construct an url to fetch the file.  Most CDNs follow this pattern to organize the files: cdnBaseUrl + pkg + ver + file.  Make sure the CDN, you want to use, adheres to this pattern.  Instead of using a CDN, you can host the files in your intranet server in this pattern.

#### fetchUrls
Type: Array of Strings

Sometimes you might want to list of file urls that need to be fetched.  This is a simple way to get a file.

```js
	fetchUrls: [
		'http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js'
		'http://cdnjs.cloudflare.com/ajax/libs/angular.js/1.2.15/angular.min.js',
		'http://cdnjs.cloudflare.com/ajax/libs/angular-ui-calendar/0.8.0/calendar.js',
	]
```

### Usage Examples

#### Default Options
In this example, the default options are used to do something with whatever. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result would be `Testing, 1 2 3.`

```js
grunt.initConfig({
  fetchFromCDN: {
    options: {},
    files: {
      'dest/default_options': ['src/testing', 'src/123'],
    },
  },
});
```

#### Custom Options
In this example, custom options are used to do something else with whatever else. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result in this case would be `Testing: 1 2 3 !!!`

```js
grunt.initConfig({
  fetchFromCDN: {
    options: {
      separator: ': ',
      punctuation: ' !!!',
    },
    files: {
      'dest/default_options': ['src/testing', 'src/123'],
    },
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
