var projs = [
  'tmerc',
  'utm',
  'sterea',
  'stere',
  'somerc',
  'omerc',
  'lcc',
  'krovak',
  'cass',
  'laea',
  'aea',
  'gnom',
  'cea',
  'eqc',
  'poly',
  'nzmg',
  'mill',
  'sinu',
  'moll',
  'eqdc',
  'vandg',
  'aeqd'
];
module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    connect: {
      server: {
        options: {
          port: process.env.PORT || 8080,
          base: '.'
        }
      }
    },
    mocha_phantomjs: {
      all: {
        options: {
          reporter: "dot",
          urls: [ //my ide requries process.env.IP and PORT
            "http://" + (process.env.IP || "127.0.0.1") + ":" + (process.env.PORT || "8080") + "/test/amd.html",
            "http://" + (process.env.IP || "127.0.0.1") + ":" + (process.env.PORT || "8080") + "/test/opt.html"
          ]
        }
      }
    },
    jshint: {
      options: {
        jshintrc: "./.jshintrc"
      },
      all: ['./lib/*.js', './lib/*/*.js']
    },
    browserify: {
      all: {
        files: {
          'dist/proj4-src.js': ['lib/index.js'],
        },
        options: {
          standalone: 'proj4',
          alias: [
            './projs:./includedProjections'
            ]
        }
      }
    },
    uglify: {
      options: {
        report: 'gzip',
        mangle:{
          except: ['proj4','Projection','Point']
        },
      },
      all: {
        src: 'dist/proj4-src.js',
        dest: 'dist/proj4.js'
      }
    },
    exec: {
      'meteor-init': {
        command: [
          // Make sure Meteor is installed, per https://meteor.com/install.
          // The curl'ed script is safe; takes 2 minutes to read source & check.
          'type meteor >/dev/null 2>&1 || { curl https://install.meteor.com/ | sh; }',
          // Meteor expects package.js to be in the root directory of
          // the checkout, so copy it there temporarily
          'cp meteor/package.js .'
        ].join(';')
      },
      // !- only add this if there was no "clean" task
      'meteor-cleanup': {
        // remove build files and package.js
        command: 'rm -rf .build.* versions.json package.js'
      },
      'meteor-test': {
        command: 'node_modules/.bin/spacejam --mongo-url mongodb:// test-packages ./'
      },
      'meteor-publish': {
        command: 'meteor publish'
      }
    }
  });
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-mocha-phantomjs');
  grunt.loadNpmTasks('grunt-exec');
  grunt.registerTask('custom',function(){
    grunt.task.run('browserify', 'uglify');
    var projections = this.args;
    if(projections[0]==='default'){
      grunt.file.write('./projs.js','module.exports = function(){}');
      return;
    }
    if(projections[0]==='all'){
      projections = projs;
    }
    grunt.file.write('./projs.js',[
      "var projs = [",
      " require('./lib/projections/"+projections.join("'),\n\trequire('./lib/projections/")+"')",
      "];",
      "module.exports = function(proj4){",
      " projs.forEach(function(proj){",
      "   proj4.Proj.projections.add(proj);",
      " });",
      "}"
    ].join("\n"));
  });
  grunt.registerTask('build',function(){
    var args = this.args.length?this.args[0].split(','):['default'];
    grunt.task.run('jshint', 'custom:'+args.join(':'));
  });
  grunt.registerTask('default', ['build:all', 'connect','mocha_phantomjs']);

  // Meteor tasks
  grunt.registerTask('meteor-test', ['exec:meteor-init', 'exec:meteor-test', 'exec:meteor-cleanup']);
  grunt.registerTask('meteor-publish', ['exec:meteor-init', 'exec:meteor-publish', 'exec:meteor-cleanup']);
  grunt.registerTask('meteor', ['exec:meteor-init', 'exec:meteor-test', 'exec:meteor-publish', 'exec:meteor-cleanup']);
};
