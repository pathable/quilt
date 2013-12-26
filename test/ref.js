var test = require('tape');
var Quilt = require('../quilt');
var Backbone = require('backbone');
Backbone.$ = require('jquery/dist/jquery')(window);

test('data-ref creates a reference.', function(t) {
  var view = new Quilt.View;
  var p = $('<p></p>')[0];
  Quilt.patches.ref.call(view, p, 'p');
  t.ok(view.$p[0] === p);
  t.end();
});
