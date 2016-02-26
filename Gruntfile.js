module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        "cssmin": {
            "target": {
                "files": [{
                    "expand": true,
                    "cwd": 'src/css',
                    "src": ['styles.css'],
                    "dest": 'dist/css',
                    "ext": '.min.css'
                }]
            }
        },
        "htmlmin": {
            "dist": {
                "options": {
                    "removeComments": true,
                    "collapseWhitespace": true
                },
                "files": {
                    "dist/index.html": "dist/index.html"
                }
            }
        },
        "uglify": {
            "my_target": {
                "files": {
                    "dist/js/app.min.js": [
                        "src/js/Lib/pikaday.js",
                        "src/js/Lib/pikaday.jquery.js",
                        "src/js/Lib/radar-chart.min.js",
                        "src/js/Models/*.js",
                        "src/js/Collections/*.js",
                        "src/js/Views/*.js",
                        "src/js/app.js"
                    ]
                }
            }
        },
        "imagemin": {
            "dynamic": {
                "files": [{
                    "expand": true,
                    "cwd": "src/",
                    "src": ["favicon.ico", "img/*.{png,jpg,svg}"],
                    "dest": "dist/"
                }]
            }
        },
        "processhtml": {
            "dist": {
                "files": {
                    'dist/index.html': ['src/index.html']
                }
            }
        }
    });

    grunt.registerTask('default', ['cssmin','uglify']);
    grunt.registerTask('processhtml', ['processhtml']);
    grunt.registerTask('img', ['imagemin']);

};