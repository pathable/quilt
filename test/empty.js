var test = require('tape');
var Quilt = require('../quilt');
var Backbone = require('backbone');
Backbone.$ = require('jquery/dist/jquery')(window);

test('data-empty', function(t) {
  var view = new Quilt.View({
    template: function() {
      return '<i data-empty></i>';
    },
    collection: new Backbone.Collection
  }).render();
  t.ok(!view.$('i').is('[class*=hide-view]'));
  view.collection.add([{id: 1}]);
  t.ok(view.$('i').is('[class*=hide-view]'));
  t.end();
});

test('data-any', function(t) {
  var view = new Quilt.View({
    template: function() {
      return '<i data-any></i>';
    },
    collection: new Backbone.Collection
  }).render();
  t.ok(view.$('i').is('[class*=hide-view]'));
  view.collection.add([{id: 1}]);
  t.ok(!view.$('i').is('[class*=hdie-view]'));
  t.end();
});

test('missing collection', 0, function(t) {
  new Quilt.View({
    template: function() {
      return '<i data-any data-empty></i>';
    }
  }).render();
  t.end();
});
