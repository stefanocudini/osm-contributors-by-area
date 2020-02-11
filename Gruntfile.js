'use strict';

module.exports = function(grunt) {

grunt.initConfig({
	pkg: grunt.file.readJSON('package.json'),
	clean: {
		dist: {
			src: ['dist/*']
		}
	},
	jshint: {
		options: {
			globals: {
				console: true,
				module: true
			},
			"-W099": true,	//ignora tabs e space warning
			"-W033": true,
			"-W044": true	//ignore regexp
		},
		files: ['main.js']
	},
	uglify: {
		dist: {
			files: {
				'dist/L.Control.Sidebar.min.js': ['leaflet-sidebar/src/L.Control.Sidebar.js'],
				'dist/main.min.js': ['main.js'],
			}
		}
	},	
	concat: {
		//TODO cut out SearchMarker
		options: {
			separator: ';\n',
			stripBanners: {
				block: true
			}
		},
		dist: {
			src: [
				'dist/L.Control.Sidebar.min.js',
				'leaflet-list-markers/dist/leaflet-list-markers.min.js',
				'leaflet-layerJSON/dist/leaflet-layerjson.src.js',			
				'colors.js',
				'social.js',
				'dist/main.min.js'			
			],
			dest: 'dist/app.min.js'
		}
	},
	cssmin: {
		combine: {
			src: [
				'leaflet-sidebar/src/L.Control.Sidebar.css',
				'leaflet-list-markers/dist/leaflet-list-markers.min.css',
				'style.css'
			],
			dest: 'dist/style.min.css'
		},
		minify: {
			expand: true,
			cwd: 'dist/',
			src: '<%= cssmin.combine.dest %>'
			//,dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.min.css'
		}
	},
	watch: {
		dist: {
			options: { livereload: true },
			files: ['main.js','index.html','style.css'],
			tasks: ['clean','jshint','uglify','concat','cssmin']
		}
	}
});

grunt.registerTask('default', [
	'clean',
	'jshint',	
	'uglify',	
	'concat',
	'cssmin'
]);


grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-concat');
grunt.loadNpmTasks('grunt-contrib-clean');
grunt.loadNpmTasks('grunt-contrib-cssmin');
grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-contrib-watch');
};
