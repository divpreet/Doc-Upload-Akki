module.exports = function(grunt) {

	var SOURCE_PATH 			= 'WebContent/documentUpload/';
	var TEMP_DESTINATION_PATH 	= 'build/WebContent/app/';
	var DESTINATION_PATH_JS 	= 'WebContent/documentUpload/minify/js/';
	var DESTINATION_PATH_CSS 	= 'WebContent/documentUpload/minify/css/';
	var DESTINATION_PATH        = 'WebContent/documentUpload/minify/';
	var randomVersion 			= ((new Date()).valueOf().toString()) + (Math.floor((Math.random()*1000000)+1).toString());
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-replace');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			files: [
			        'GruntFile.js'
			        ],
			        options: {
			        }
		},
		concat: {
			options: {
				separator: ';'
			},
			base: {
				cwd: SOURCE_PATH,
				files: {
					'build/WebContent/app/scripts/libs.js': [
					                                      
					                                      SOURCE_PATH + 'js/vendor/angular.js',
					                                      SOURCE_PATH + 'js/vendor/angular-ui-router.js',
					                                      SOURCE_PATH + 'js/vendor/site.js'
					                                     ],
                   'build/WebContent/app/scripts/application.js': [
                                                          SOURCE_PATH + 'js/app.js',
                                                          SOURCE_PATH + 'js/state.js',
                                                          SOURCE_PATH + 'js/user-roles.js',
                                                          SOURCE_PATH + 'js/core/create-new-controller.js',
                                                          SOURCE_PATH + 'js/core/dashboard-controller.js',
                                                          SOURCE_PATH + 'js/core/rest-service.js',
                                                          SOURCE_PATH + 'js/notification/notification.js',
                                                          SOURCE_PATH + 'js/notification/notification-directive.js'
                                                         ]
				}
			},
			min: {
				cwd: SOURCE_PATH,
				files: {
					'WebContent/documentUpload/minify/application.min.js': [
					                                                      DESTINATION_PATH_JS   +'libs.min.js',
					                                                      DESTINATION_PATH_JS   +'application.min.js'
					                                                     ]
				}
			}
		},
		uglify: {
			options:{
				ASCIIOnly : true
			},
			app: {
				src     : TEMP_DESTINATION_PATH  +'scripts/application.js',
				dest    : DESTINATION_PATH_JS   +'application.min.js'
			},
			lib: {
				src     : TEMP_DESTINATION_PATH  +'scripts/libs.js',
				dest    : DESTINATION_PATH_JS   +'libs.min.js'
			}
		},
		replace: {
			build_replace: {
				options: {
					variables: {
						'randomVersion': randomVersion
					}
				},
				files: [
				        {
				        	src     : SOURCE_PATH + 'launch.jsp',
				        	dest    : SOURCE_PATH + 'launch.jsp'
				        },
				        {
				        	src     : DESTINATION_PATH + 'application.min.js',
				        	dest    : DESTINATION_PATH + 'application.min.'+randomVersion+'.js'
				        }
				        ]
			}
		},
		clean: {
			resource: [DESTINATION_PATH_JS,DESTINATION_PATH_CSS,TEMP_DESTINATION_PATH],
			output: [DESTINATION_PATH]
		}

	});

	grunt.registerTask('default', ['clean:output','jshint','concat:base','uglify:app','uglify:lib','concat:min','replace','clean:resource']);
};