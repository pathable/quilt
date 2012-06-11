module.exports = function(grunt) {

  grunt.registerTask('default', 'lint qunit');

  grunt.initConfig({
    qunit: {
      quilt: 'test/index.html'
    },
    lint: {
      quilt: 'quilt.js',
      test: 'test/*.js'
    },
    jshint: {
      options: {
        boss: true,
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
        $: true,
        jQuery: true,
        Backbone: true,
        Quilt: true
      }
    }
  });

};
