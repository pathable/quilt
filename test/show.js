var test = require('tape');
var Quilt = require('../quilt');
var Backbone = require('backbone');
Backbone.$ = require('jquery/dist/jquery')(window);

test('data-show', function(t) {
  var view = new Quilt.View({
    template: function(){
      return '<p><i data-show="x"></i></p>';
    },
    model: new Backbone.Model({x: true})
  }).render();
  t.ok(!view.$('i').is('[class*=hide-view]'));
  view.model.set({x: false});
  t.ok(view.$('i').is('[class*=hide-view]'));
  t.end();
});

test('data-hide', function(t) {
  var view = new Quilt.View({
    template: function() {
      return '<p><i data-hide="x"></i></p>';
    },
    model: new Backbone.Model({x: true})
  }).render();
  t.ok(view.$('i').is('[class*=hide-view]'));
  view.model.set({x: false});
  t.ok(!view.$('i').is('[class*=hide-view]'));
  t.end();
});

test('missing model', 0, function(t) {
  new Quilt.View({
    template: function() {
      return '<p><i data-hide="x"></i></p>';
    }
  }).render();
  t.end();
});
