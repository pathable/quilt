var exec = require('child_process').exec;

module.exports = function(grunt) {

  grunt.initConfig({
    qunit: {
      quilt: 'test/index.html'
    },
    lint: {
      quilt: 'quilt.js',
      test: 'test/*.js'
    },
    min: {
      'quilt.min.js': 'quilt.js'
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

  grunt.registerTask('default', 'lint qunit');

  // Release task, to be run only just before cutting a release in order to
  // keep the commit log clean.
  grunt.registerTask('release', 'default docco min');

  // Build docco docs.
  grunt.registerTask('docco', function() {

    // Inform grunt when we're finished.
    var done = this.async();

    // Kick off docco and log results.
    exec('docco quilt.js', function(err, stdout, stderr) {
      if (err) {
        grunt.log.error(err);
        return done(err.code);
      }
      grunt.log.write(stdout);
      done();
    });

  });

};
