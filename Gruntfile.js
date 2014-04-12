/*
 * grunt-fetch-from-cdn
 * https://github.com/bandelde/grunt-fetch-from-cdn
 *
 * Copyright (c) 2014 Vijey Narayanaswamy
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		jshint: {
			all: [
				'Gruntfile.js',
				'tasks/*.js'
			],
			options: {
				jshintrc: '.jshintrc',
			},
		},

		// Configuration to be run (and then tested).
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

	grunt.loadTasks('tasks');

 	grunt.loadNpmTasks('grunt-contrib-jshint');

 	grunt.registerTask('default', ['jshint']);

};
