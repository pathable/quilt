var _ = require('underscore');
var Quilt = require('../quilt');
var Backbone = require('backbone');
Backbone.$ = require('jquery');

var patches = Quilt.patches;

var test = function(name, callback) {
  require('tape')(name, function(t) {
    Quilt.patches = _.clone(patches);
    callback(t);
  });
};

test('Collection and Model events are cleaned up on dispose.', function(t) {
  t.plan(0);
  var model = new Backbone.Model;
  var collection = new Backbone.Collection;
  var view = new Quilt.View({model: model, collection: collection});
  view.listenTo(model, 'event', function(){ t.ok(false); });
  view.listenTo(collection, 'event', function() { t.ok(false); });
  view.dispose();
  model.trigger('event');
  collection.trigger('event');
  t.end();
});

test('Child views are disposed of.', function(t) {
  t.plan(1);
  var parent = new Quilt.View;
  var child = new Quilt.View;
  child.dispose= function() {
    t.ok(this === child);
  };
  parent.addView(child);
  parent.dispose();
  t.end();
});

test('Dashes are inserted into data attributes.', function(t) {
  t.plan(2);
  Quilt.patches.testAttr = function(el, options) {
    t.is(options, 'test');
    t.is(el.tagName.toLowerCase(), 'p');
  };
  var view = new Quilt.View;
  view.template = function() {
    return '<p data-test-attr="test"></p>';
  };
  view.render();
  t.end();
});

test('Other data attributes are ignored.', function(t) {
  t.plan(2);
  Quilt.patches.first = function() {
    t.ok(true);
  };
  Quilt.patches.second = function() {
    t.ok(true);
  };
  var view = new Quilt.View;
  view.template = function() {
    return '<p data-first data-ignore data-second></p>';
  };
  view.render();
});

test('Tolerate non-view return from attribute function.', function(t) {
  t.plan(0);
  Quilt.patches.test = function() { return {}; };
  var view = new Quilt.View({model: new Backbone.Model});
  view.template = function() { return '<p data-test="true"></p>'; };
  view.render();
  t.end();
});

test('Dispose is chainable.', function(t) {
  t.plan(1);
  var view = new Quilt.View;
  t.ok(view.dispose() === view);
  t.end();
});

test('Dispose removes DOM listeners', function(t) {
  t.plan(0);
  var View = Quilt.View.extend({
    events: {click: 'click'},
    click: function(){ t.ok(false); }
  });
  new View().dispose().$el.click();
  t.end();
});

test('Accept template function in options.', function(t) {
  t.plan(1);
  var view = new Quilt.View({
    template: function(){ return 'x'; }
  }).render();
  t.is(view.$el.html(), 'x');
  t.end();
});

test('Null template option is discarded.', function(t) {
  t.plan(1);
  var View = Quilt.View.extend({
    template: function(){ return 'x'; }
  });
  var view = new View({template: null}).render();
  t.is(view.$el.html(), 'x');
  t.end();
});

test('Undefined options does not throw.', function(t) {
  t.plan(1);
  t.doesNotThrow(function() {
    new Quilt.View;
  });
  t.end();
});

test('Render disposes old child views.', function(t) {
  t.plan(1);
  var view = new Quilt.View;
  var child = new Quilt.View;
  child.dispose = function() { t.ok(true); };
  view.addView(child);
  view.render();
  t.end();
});

test('addView', function(t) {
  t.plan(1);
  var view = new Quilt.View;
  var child = new Quilt.View;
  view.addView(child);
  t.ok(view.views[0] === child);
  t.end();
});

test('renderView', function(t) {
  t.plan(2);
  var view = new Quilt.View;
  var View = Quilt.View.extend({
    render: function() {
      t.ok(true);
      return this;
    }
  });
  var child = new View;
  view.renderView(child);
  t.ok(view.views[0] === child);
  t.end();
});

test('Alter attributes during iteration.', function(t) {
  t.plan(1);
  Quilt.patches.foo = function(el) { el.removeAttribute('href'); };
  Quilt.patches.bar = function(el) { t.ok(true); };
  var view = new Quilt.View;
  view.template = function() {
    return '<a href="/" data-foo data-bar></a>';
  };
  view.render();
  t.end();
});

