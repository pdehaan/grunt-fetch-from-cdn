/*
 * grunt-fetch-from-cdn
 * https://github.com/vijeysrc/grunt-fetch-from-cdn
 *
 * Copyright (c) 2014 Vijey Narayanaswamy
 * Licensed under the MIT license.
 */

/*
* TODO LIST:
* = also get minimap file if available
* = validate the url string
* = how to correctly merge the given and default options
*/

'use strict';

module.exports = function(grunt) {

	var _ = require('lodash'),
		request = require('request'),
		fs = require('fs'),
		path = require('path'),
		util = {
			cdnMap : {
				googleapis: 'https://ajax.googleapis.com/ajax/libs',
				jsdelivr: 'http://cdn.jsdelivr.net',
				cdnjs: 'http://cdnjs.cloudflare.com/ajax/libs'
			},

			prepareFinalList: function (dataInput, cdnBaseUrl) {

				var fetch = dataInput.fetch,
					fetchUrls = dataInput.fetchUrls,
					output = [];

				cdnBaseUrl = cdnBaseUrl.replace(/\/$|\\$/, ''); //Remove trailing forward or backward slash

				if (_.isArray(fetch)) {
					_.forEach(fetch, function (item) {
						item['url'] = cdnBaseUrl + util.urlConstructLogic(item);
						if (util.validateUrl(item['url'])) {
							output.push(item);
						} else {
							grunt.log.error('[ERROR] Invalid url string: ' + item['url']);
						}
					});
				}

				if (_.isArray(fetchUrls)) {
					_.forEach(fetchUrls, function (item) {
						if (util.validateUrl(item)) {
							output.push(item);
						} else {
							grunt.log.error('[ERROR] Invalid url string: ' + item);
						}
					});
				}

				return output;
			},

			urlConstructLogic: function (inputObj) {
				return '/' + inputObj.pkg + '/' + inputObj.ver + '/' + inputObj.file;
			},

			checkAndLoadClean: function () {
				function isCleanPresent() {
					return 'undefined' !== typeof grunt.task._tasks.clean;
				}

				if (!isCleanPresent()) {
					grunt.loadNpmTasks('grunt-contrib-clean');
				}
			},

			checkAndLoadCopy: function () {
				function isCopyPresent() {
					return 'undefined' !== typeof grunt.task._tasks.copy;
				}

				if (!isCopyPresent()) {
					grunt.loadNpmTasks('grunt-contrib-copy');
				}
			},



			validateUrl: function (value){
				return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
			}
		};

	grunt.registerMultiTask('fetchFromCDN', 'This grunt plugin can fetch single file (say jquery.js) from a CDN.  Unlike bower, it fetches only a single file and not the entire project.', function() {

		var tmpDir = path.resolve(process.cwd(), 'fetchFromCDNTmp'),
			fetchListFinal = [],
			dest = this.data.dest,
			i,
			options = this.options({
				cdnBaseUrl: util.cdnMap['jsdelivr'],
				flatten: false
			});

		if (!(dest)) {
			grunt.fail.warn('dest field is missing');
		}

		fetchListFinal = util.prepareFinalList(this.data, options.cdnBaseUrl);

		/**
		 * Setting up clean up tasks
		 */

		util.checkAndLoadClean();

		grunt.config.set('clean.fetchFromCDNClean', {
			'src': [tmpDir]
		});


		/**
		 * Setting up fetch tasks
		 */


		grunt.registerTask('startFetchFromCDN', function() {

			var done = this.async(),
				cnt = 0;

			fs.mkdirSync(tmpDir);

			function fetchNow(cnt) {

				var fetchItem = fetchListFinal[cnt],
					currFilePath,
					currFileUrl,
					ws;

				if (_.isString(fetchItem)) {
					currFilePath = tmpDir + '/' + fetchItem.split('/')[fetchItem.split('/').length - 1];
					currFileUrl = fetchItem;
				} else {
					if (options.flatten) {
						currFilePath = tmpDir + '/' + fetchItem.file;
					} else {
						currFilePath = tmpDir + '/' + fetchItem.pkg + '/' + fetchItem.ver + '/' + fetchItem.file;
						grunt.file.mkdir(tmpDir + '/' + fetchItem.pkg + '/' + fetchItem.ver);
					}

					currFileUrl = fetchItem.url;
				}

				currFilePath = path.resolve(currFilePath);

				request(currFileUrl, function (err, res, body) {
					if (err || res.statusCode !== 200) {
						if (!options.flatten) {
							grunt.file.delete(tmpDir + '/' + fetchItem.pkg);
						}
						grunt.log.error([currFileUrl + ' could not be fetched as the request to this file has failed: ']);
					} else {
						fs.writeFileSync(currFilePath, body);
					}

					cnt++;
					if (cnt < fetchListFinal.length) {
						fetchNow(cnt);
					} else {
						done();
					}

				});

			}

			fetchNow(cnt);

		});

		/**
		 * Setting up copy tasks
		 */

		util.checkAndLoadCopy();

		grunt.config.set('copy.ffcdnCopyFiles', {
			nonull: true,
			expand: true,
			cwd: path.resolve(process.cwd(), tmpDir),
			src: '**/*.*',
			dest: path.join(process.cwd(), dest)
		});


		/**
		 * Setting up concat tasks - START
		 */

		/*if (!isConcatPresent()) {
			grunt.loadNpmTasks('grunt-contrib-concat');
		}

		function isConcatPresent() {
			return 'undefined' !== typeof grunt.task._tasks.concat;
		}

		grunt.config.set('concat.fetchAndConcat', {
			'src': fetchFullPathList,
			'dest': dest
		});*/


		/**
		 * Setting up concat tasks - END
		 */


		grunt.task.run(['clean:fetchFromCDNClean', 'startFetchFromCDN', 'copy:ffcdnCopyFiles', 'clean:fetchFromCDNClean']);

	});

};
