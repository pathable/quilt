module.exports = function(grunt) {

  grunt.registerTask('default', 'lint qunit');

  grunt.initConfig({
    qunit: ['./test/index.html'],
    lint: ['kinetic.js', './test/*.js'],
    jshint: {
      options: {
        boss: true,
        eqnull: true,
        undef: true
      },
      globals: {
        // QUnit
        ok: true,
        test: true,
        module: true,
        raises: true,
        deepEqual: true,
        strictEqual: true,

        // Dependencies
        _: true,
        moment: true,
        jQuery: true,
        Backbone: true,
        Kinetic: true
      }
    }
  });

};

