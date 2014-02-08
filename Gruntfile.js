module.exports = function (grunt) {

  require('time-grunt')(grunt);
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    shell: {
      options: {
        stdout: true
      },
      npm_install: {
        command: 'npm install'
      },
      bower_install: {
        command: './node_modules/.bin/bower install'
      },
      font_awesome_fonts: {
        command: 'cp -R bower_components/components-font-awesome/font/ app/font'
      }
    },

    connect: {
      options: {
        base: 'app/'
      },
      webserver: {
        options: {
          port: 8888,
          keepalive: true
        }
      },
      devserver: {
        options: {
          port: 8888,
          keepalive: true
        }
      },
      testserver: {
        options: {
          port: 9999
        }
      },
      coverage: {
        options: {
          base: 'coverage/',
          port: 5555,
          keepalive: true
        }
      }
    },

    open: {
      devserver: {
        path: 'http://localhost:8888'
      },
      coverage: {
        path: 'http://localhost:5555'
      }
    },

    develop: {
      server: {
        file: 'server.js'
      }
    },

    verbosity: {
      server: {
        tasks: ['karma:e2e']
      }
    },

    karma: {
      unit: {
        configFile: './test/karma-unit.conf.js',
        autoWatch: false,
        singleRun: true
      },
      unit_auto: {
        configFile: './test/karma-unit.conf.js',
        autoWatch: true,
      },
      midway: {
        configFile: './test/karma-midway.conf.js',
        autoWatch: false,
        singleRun: true
      },
      midway_auto: {
        configFile: './test/karma-midway.conf.js'
      },
      e2e: {
        configFile: './test/karma-e2e.conf.js',
        autoWatch: false,
        singleRun: true
      },
      e2e_auto: {
        configFile: './test/karma-e2e.conf.js'
      },
      unit_coverage: {
        configFile: './test/karma-unit.conf.js',
        autoWatch: false,
        singleRun: true,
        reporters: ['progress', 'coverage'],
        preprocessors: {
          'app/js/controllers.js': ['coverage']
        },
        coverageReporter: {
          type: 'html',
          dir: 'coverage/'
        }
      }
    },

    watch: {
      assets: {
        files: ['app/styles/**/*.css', 'app/scripts/**/*.js'],
        tasks: ['concat']
      }
    },

    concat: {
      styles: {
        dest: './app/assets/app.css',
        src: [
          'app/styles/reset.css',
          'bower_components/components-font-awesome/css/font-awesome.css',
          'bower_components/bootstrap.css/css/bootstrap.css',
          'app/styles/app.css'
        ]
      },
      scripts: {
        options: {
          separator: ';'
        },
        dest: './app/assets/app.js',
        src: [
          'bower_components/angular/angular.js',
          'bower_components/angular-route/angular-route.js',
          'bower_components/angularjs-scope.safeapply/src/Scope.SafeApply.js',
          'app/scripts/lib/router.js',
          'app/scripts/config/config.js',
          'app/scripts/services/**/*.js',
          'app/scripts/directives/**/*.js',
          'app/scripts/controllers/**/*.js',
          'app/scripts/filters/**/*.js',
          'app/scripts/config/routes.js',
          'app/scripts/app.js'
        ]
      }
    }
  });

  grunt.registerTask('test', ['verbosity', 'develop:server', 'karma:unit', 'karma:midway', 'karma:e2e']);
  grunt.registerTask('test:unit', ['karma:unit']);
  grunt.registerTask('test:midway', ['verbosity', 'develop:server', 'karma:midway']);
  grunt.registerTask('test:e2e', ['verbosity', 'develop:server', 'karma:e2e']);

  // coverage testing
  grunt.registerTask('test:coverage', ['karma:unit_coverage']);
  grunt.registerTask('coverage', ['karma:unit_coverage', 'open:coverage', 'connect:coverage']);

  // installation-related
  grunt.registerTask('install', ['shell:npm_install', 'shell:bower_install', 'shell:font_awesome_fonts']);

  // defaults
  grunt.registerTask('default', ['dev']);

  // development
  grunt.registerTask('dev', ['install', 'concat', 'connect:devserver', 'open:devserver', 'watch:assets']);

  // server daemon
  grunt.registerTask('serve', ['connect:webserver']);
};
