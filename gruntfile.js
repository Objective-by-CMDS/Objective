module.exports = function(grunt) {

	// Configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		
		sass: {
			make: {
				options: {
					style: 'compressed',
					sourcemap: true
				},
				files: [{
					expand: true,
					flatten: true,
					cwd: 'app/public/assets/styles/src/',
					src: ['*.scss'],
					dest: 'app/public/assets/styles/src/',
					ext: '.sassed.css'
				}]
			}
		},
        
		autoprefixer: {
            options: {
				browsers: ['> 1%', 'last 2 versions', 'ie 9', 'ie 8', 'firefox 24', 'opera 12.1'],
				map: true
			},
			prefix: {
				expand: true,
				flatten: true,
				cwd: 'app/public/assets/styles/src/',
				src: ['*.sassed.css'],
				dest: 'app/public/assets/styles/',
				ext: '.css'
			}
		},

        watch: {
			css: {
				files: ['css/*.scss'],
				tasks: ['sass', 'autoprefixer'],
				options: {
					spawn: false
				}
			},
			livereload: {
				options: { livereload: true },
				files: ['*.html', 'app/public/assets/styles/src/*.scss'],
			}
		},
    });
    
    // Plugin List
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-watch');

	// Workflows
	// $ grunt: Concencates, prefixes, minifies JS and CSS files. The works.
	grunt.registerTask('default', ['sass', 'autoprefixer']);
		
	// $ grunt dev: Watches for changes while developing
	grunt.registerTask('dev', ['watch']);

};