var _ = require('underscore');
var Quilt = require('../quilt');
var Backbone = require('backbone');
Backbone.$ = require('jquery/dist/jquery')(window);

var patches = Quilt.patches;

var test = function(name, options, callback) {
  if (_.isFunction(options)) {
    callback = options;
    options = null;
  }
  require('tape')(name, options, function(t) {
    Quilt.patches = _.clone(patches);
    callback(t);
  });
};

test('Collection and Model events are cleaned up on dispose.', 0, function(t) {
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

test('Child views are disposed of.', 1, function(t) {
  var parent = new Quilt.View;
  var child = new Quilt.View;
  child.dispose= function() {
    t.ok(this === child);
  };
  parent.addView(child);
  parent.dispose();
  t.end();
});

test('Dashes are inserted into data attributes.', 2, function(t) {
  Quilt.patches.testAttr = function(el, options) {
    t.strictEqual(options, 'test');
    t.ok($(el).is('p'));
  };
  var view = new Quilt.View;
  view.template = function() {
    return '<p data-test-attr="test"></p>';
  };
  view.render();
  t.end();
});

test('Other data attributes are ignored.', 1, function(t) {
  Quilt.patches.exists = function() {
    t.ok(true);
  };
  var view = new Quilt.View;
  view.template = function() {
    return '<p data-exists="true" data-doesnt="false"></p>';
  };
  view.render();
  t.end();
});

test('Tolerate non-view return from attribute function.', 0, function(t) {
  Quilt.patches.test = function() { return {}; };
  var view = new Quilt.View({model: new Backbone.Model});
  view.template = function() { return '<p data-test="true"></p>'; };
  view.render();
  t.end();
});

test('Dispose is chainable.', 1, function(t) {
  var view = new Quilt.View;
  t.ok(view.dispose() === view);
  t.end();
});

test('Dispose removes DOM listeners', 0, function(t) {
  var View = Quilt.View.extend({
    events: {click: 'click'},
    click: function(){ t.ok(false); }
  });
  new View().dispose().$el.click();
  t.end();
});

test('Accept template function in options.', 1, function(t) {
  var view = new Quilt.View({
    template: function(){ return 'x'; }
  }).render();
  t.strictEqual(view.$el.html(), 'x');
  t.end();
});

test('Null template option is discarded.', 1, function(t) {
  var View = Quilt.View.extend({
    template: function(){ return 'x'; }
  });
  var view = new View({template: null}).render();
  t.strictEqual(view.$el.html(), 'x');
  t.end();
});

test('Undefined options does not throw.', 0, function(t) {
  var view = new Quilt.View;
  t.end();
});

test('Render disposes old child views.', 1, function(t) {
  var view = new Quilt.View;
  var child = new Quilt.View;
  child.dispose = function() { t.ok(true); };
  view.addView(child);
  view.render();
  t.end();
});

test('addView', 1, function(t) {
  var view = new Quilt.View;
  var child = new Quilt.View;
  view.addView(child);
  t.ok(view.views[0] === child);
  t.end();
});

test('renderView', 2, function(t) {
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

test('Alter attributes during iteration.', 1, function(t) {
  Quilt.patches.foo = function(el) { el.removeAttribute('href'); };
  Quilt.patches.bar = function(el) { t.ok(true); };
  var view = new Quilt.View;
  view.template = function() {
    return '<a href="/" data-foo data-bar></a>';
  };
  view.render();
  t.end();
});

