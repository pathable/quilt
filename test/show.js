var test = require('tape');
var Quilt = require('../quilt');
var Backbone = require('backbone');
Backbone.$ = require('jquery');

test('data-show', function(t) {
  t.plan(2);
  var view = new Quilt.View({
    template: function(){
      return '<i data-show="x"></i>';
    },
    model: new Backbone.Model({x: true})
  }).render();
  t.ok(!view.$('i').is('[class*=hide-view]'));
  view.model.set({x: false});
  t.ok(view.$('i').is('[class*=hide-view]'));
  t.end();
});

test('data-hide', function(t) {
  t.plan(2);
  var view = new Quilt.View({
    template: function() {
      return '<i data-hide="x"></i>';
    },
    model: new Backbone.Model({x: true})
  }).render();
  t.ok(view.$('i').is('[class*=hide-view]'));
  view.model.set({x: false});
  t.ok(!view.$('i').is('[class*=hide-view]'));
  t.end();
});

test('missing model', function(t) {
  t.plan(0);
  new Quilt.View({
    template: function() {
      return '<i data-hide="x"></i>';
    }
  }).render();
  t.end();
});

test('Multiple show views.', function(t) {
  t.plan(1);
  var view = new Quilt.View({
    model: new Backbone.Model({foo: false, bar: false}),
    template: function() {
      return '<i data-show="foo" data-hide="bar"></i>';
    }
  }).render();
  t.ok(view.$('i').is('[class*=hide-view]'));
  t.end();
});
