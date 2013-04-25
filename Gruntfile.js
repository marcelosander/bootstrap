/*jshint node:true*/
module.exports = function( grunt ) {
	"use strict";

	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		watch: {
			css: {
				files: [ "styles/*.less" ],
				tasks: [ "css" ]
			},
			js: {
				files: [ "scripts/*.js" ],
				tasks: [ "js" ]
			},
			jsTest: {
				files: [ "tests/specs/**/*.js", "tests/templates/**/*.hbs" ],
				tasks: [ "js-test" ]
			},
			docs: {
				files: [ "docs/templates/**/*.hbs", "docs/main.less" ],
				tasks: [ "docs" ]
			}
		},
		clean: {
			// Limpado antes da execução
			css:    [ "dist/*.css", "dist/fonts/", "dist/images/" ],
			js:     [ "dist/scripts/", "tests/*.html" ],
			docs:   [ "*.html" ],
			dist:   [ "dist/*.json" ],

			// Remove a fonte e configuração utilizada no IcoMoon
			font:   [ "dist/fonts/*.json", "dist/fonts/*dev.svg" ]
		},
		less: {
			main: {
				options: {
					strictImports: true
				},
				files: {
					"dist/bootstrap.css": "styles/bootstrap.less",
					"dist/jquery.ui.css": [
						// Junta TODOS os arquivos do jQuery UI, na sua ordem certa.
						// @TODO usar apenas o core + glob *.css. Será que vai excluir o core deste glob pra ficar na ordem certa?
						"styles/jquery.ui/*core.css",
						"styles/jquery.ui/*accordion.css",
						"styles/jquery.ui/*autocomplete.css",
						"styles/jquery.ui/*button.css",
						"styles/jquery.ui/*datepicker.css",
						"styles/jquery.ui/*dialog.css",
						"styles/jquery.ui/*menu.css",
						"styles/jquery.ui/*progressbar.css",
						"styles/jquery.ui/*resizable.css",
						"styles/jquery.ui/*selectable.css",
						"styles/jquery.ui/*slider.css",
						"styles/jquery.ui/*spinner.css",
						"styles/jquery.ui/*tabs.css",
						"styles/jquery.ui/*tooltip.css",
						"styles/jquery.ui.less"
					]
				}
			},
			docs: {
				options: {
					strictImports: true,
					yuicompressor: true
				},
				files: {
					"docs/main.css": "docs/main.less"
				}
			}
		},
		hogan: {
			docs: {
				layout: "docs/templates/layout.hbs",
				src: [
					"docs/templates/pages/*.hbs"
				],
				dest: "."
			},
			tests: {
				layout: "tests/templates/layout.hbs",
				src: [
					"tests/templates/pages/*.hbs",
					"tests/templates/index.hbs"
				],
				dest: "tests"
			}
		},
		copy: {
			dist: {
				src: [ "*.json" ],
				dest: "dist"
			},
			css: {
				src: [
					"images/*",
					"dist/*.css",
					"fonts/*"
				],
				strip: /^dist/,
				dest: "dist"
			},
			js: {
				src: [ "scripts/*.js" ],
				dest: "dist"
			}
		},
		linestrip: {
			// Remove a linha com o background especificado no regex. Evita que cause erros 404, pois a imagem não existirá em nosso repo.
			jqueryui: {
				src: [ "dist/jquery.ui.css" ],
				regex: [
					/images\/animated-overlay.gif/
				]
			}
		},
		qunit: {
			files: [ "tests/index.html" ]
		},
		jshint: {
			options: {
				jshintrc: ".jshintrc"
			},
			js: [ "scripts/*.js", "tests/**/*.js" ],
			docs: {
				files: {
					src: "docs/main.js"
				}
			}
		},
		connect: {
			visual: {
				options: {
					hostname: "*",
					keepalive: true,
					port: 8001
				}
			}
		}
	});

	// Carrega as tasks que dependemos...
	grunt.loadNpmTasks("grunt-contrib-less");
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-contrib-qunit");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-connect");

	// ...inclusive as criadas por nós!
	grunt.loadTasks("build");

	// Registra as tasks alias
	grunt.registerTask( "css",      [ "clean:css", "less:main", "copy:css", "clean:font", "linestrip" ] );
	grunt.registerTask( "js-test",  [ "hogan:tests", "jshint:js", "qunit" ] );
	grunt.registerTask( "js",       [ "clean:js", "jshint:js", "js-test", "copy:js" ] );
	grunt.registerTask( "docs",     [ "clean:docs", "less:docs", "jshint:docs", "hogan:docs" ] );
	grunt.registerTask( "default",  [ "clean:dist", "css", "js", "docs", "copy:dist" ] );
};