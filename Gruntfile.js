/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %>\n' + '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' + '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' + ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: ['components/angular-seed/app/lib/angular/angular.min.js', 'components/angular-bootstrap/ui-bootstrap.js', 'components/angular-seed/app/lib/angular/angular-resource.min.js', 'components/angular-seed/app/lib/angular/angular-sanitize.min.js', 'angular-app/app.js', 'angular-app/controllers.js', 'angular-app/directives.js', 'angular-app/filters.js', 'angular-app/services.js'],
        //src: ['lib/<%= pkg.name %>.js'],
        dest: 'dist/<%= pkg.name %>.js' 
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true
        }
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib_test: {
        src: ['lib/**/*.js', 'test/**/*.js']
      }
    },
    qunit: {
      files: ['test/**/*.html']
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib_test: {
        files: '<%= jshint.lib_test.src %>',
        tasks: ['jshint:lib_test', 'qunit']
      }
    },
    copy: {
      main: {
        files: {
          'public/js/': ['dist/atlmaps.min.js']
        }
      }
    },
    cssmin: {
      combine: {
        files: {
          'public/css/app.min.css': ['components/bootstrap/docs/assets/css/bootstrap.css', 'components/bootstrap/docs/assets/css/bootstrap-responsive.css', 'components/angular-ui/build/angular-ui.css', 'public/css/app.css']
        }
      }
    },
    deploy: {
    liveservers: {
      options:{
        servers: [{
          host: 'atlantamaps',
          port: 22,
          username: 'node',
          password: ''
        }],
        cmds_before_deploy: ["ls"],
        cmds_after_deploy: ["ls"],
        deploy_path: 'apps/atlmaps'
      }
    }
  },
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-deploy');



  // Default task.
  grunt.registerTask('default', [])//'jshint', 'concat', 'uglify', 'copy', 'cssmin']);

};