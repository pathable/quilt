(function() {

  var View = Quilt.View;
  var Model = Backbone.Model;
  var Collection = Backbone.Collection;

  var attrs = _.clone(Quilt.patches);

  module('View', {

    setup: function() {
      delete Quilt.selector;
      Quilt.patches = attrs;
    }

  });

  test('Collection and Model events are cleaned up on dispose.', 0, function() {
    var model = new Model();
    var collection = new Collection();
    var view = new View({model: model, collection: collection});
    view.listenTo(model, 'event', function(){ ok(false); });
    view.listenTo(collection, 'event', function() { ok(false); });
    view.dispose();
    model.trigger('event');
    collection.trigger('event');
  });

  test('Child views are disposed on dispose.', 1, function() {
    var parent = new View();
    var child = new View();
    child.dispose= function() {
      ok(this === child);
    };
    parent.views.push(child);
    parent.dispose();
  });

  test('Dashes are inserted into data attributes.', 2, function() {
    Quilt.patches.testAttr = function(el, options) {
      strictEqual(options, 'test');
      ok($(el).is('p'));
    };
    var view = new View();
    view.template = function() {
      return '<p data-test-attr="test"></p>';
    };
    view.render();
  });

  test('Other data attributes are ignored.', 1, function() {
    Quilt.patches.exists = function() {
      ok(true);
    };
    var view = new View();
    view.template = function() {
      return '<p data-exists="true" data-doesnt="false"></p>';
    };
    view.render();
  });

  test('template gets view, model, and collection.', 3, function() {
    var model = new Model();
    var collection = new Collection();
    var view = new View({model: model, collection: collection});
    view.template = function(data) {
      ok(data.view === view);
      ok(data.model === model);
      ok(data.collection === collection);
      return '';
    };
    view.render();
  });

  test('Tolerate non-view return from attribute function.', 0, function() {
    Quilt.patches.test = function() { return {}; };
    var view = new View({model: new Model()});
    view.template = function() { return '<p data-test="true"></p>'; };
    view.render();
  });

  test('Dispose is chainable.', 1, function() {
    var view = new View();
    ok(view.dispose() === view);
  });

  test('Dispose removes DOM listeners', 0, function() {
    var View = Quilt.View.extend({
      events: {click: 'click'},
      click: function(){ ok(false); }
    });
    new View().dispose().$el.click();
  });

  test('Accept template function in options.', 1, function() {
    var view = new Quilt.View({
      template: function(){ return 'x'; }
    }).render();
    strictEqual(view.$el.html(), 'x');
  });

  test('Null template option is discarded.', 1, function() {
    var View = Quilt.View.extend({
      template: function(){ return 'x'; }
    });
    var view = new View({template: null}).render();
    strictEqual(view.$el.html(), 'x');
  });

  test('Undefined options does not throw.', 0, function() {
    var view = new Quilt.View();
  });

  test('Render disposes old child views.', 1, function() {
    var view = new Quilt.View();
    var child = new Quilt.View();
    child.dispose = function() { ok(true); };
    view.views.push(child);
    view.render();
  });

  test('Support locally-defined patches.', 2, function() {
    Quilt.patches.test = function() { ok(true); };
    var View = Quilt.View.extend({
      patches: { other: function(el, options) { ok(true); } }
    });
    var view = new View();
    view.template = function() { return '<div data-test data-other></div>'; }
    view.render();
  });

  test('Ignore local patches from other views.', 1, function() {
    Quilt.patches.test = function() { ok(true); };
    var Other = Quilt.View.extend({
      patches: { other: function(el, options) { ok(true); } }
    });
    var view = new Quilt.View();
    view.template = function() { return '<div data-test data-other></div>'; }
    view.render();
  });

  test('Local patches can be inherited and extended.', 5, function() {
    var View = Quilt.View.extend({
      patches: function() {
        return {
          all: function(el, options) { ok(true); },
          test: function(el, options) { strictEqual(el.id, 'base'); }
        }
      }
    });
    var view = new View();
    view.template = function() { return '<div id="base" data-all data-test></div>'; }
    view.render();
    var RelatedView = View.extend({
      patches: function() {
        return _.extend({}, View.prototype.patches.apply(this), {
          test: function(el, options) { strictEqual(el.id, 'related'); },
          other: function(el, options) { strictEqual(el.id, 'related'); }
        });
      }
    });
    var related = new RelatedView();
    related.template = function() { return '<div id="related" data-all data-test data-other></div>'; }
    related.render();
  });

})();
