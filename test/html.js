var test = require('tape');
var Quilt = require('../quilt');
var Backbone = require('backbone');
Backbone.$ = require('jquery/dist/jquery')(window);

test('data-html', function(t) {
  var view = new Quilt.View({
    template: function() {
      return '<p><i data-html="x"></i></p>';
    },
    model: new Backbone.Model({x: 'x'})
  }).render();
  t.is(view.$('i').html(), 'x');
  view.model.set({x: 'y'});
  t.is(view.$('i').html(), 'y');
  t.end();
});

test('data-text', 1, function(t) {
  var view = new Quilt.View({
    template: function() {
      return '<p><i data-text="x"></i></p>';
    },
    model: new Backbone.Model({x: '1 < 2'})
  }).render();
  t.is(view.$('i').html(), '1 &lt; 2');
  t.end();
});

test('missing model', 0, function(t) {
  new Quilt.View({
    template: function() {
      return '<p><i data-text="x"></i></p>'
    }
  }).render();
  t.end();
});
