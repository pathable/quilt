var test = require('tape');
var Quilt = require('../quilt');
var Backbone = require('backbone');
Backbone.$ = require('jquery');

test('data-ref creates a reference.', function(t) {
  t.plan(1);
  var view = new Quilt.View({
    template: function() {
      return '<p data-ref="test"></p>';
    }
  }).render();
  t.ok(view.$test[0] === view.$('p')[0]);
  t.end();
});
