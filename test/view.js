(function() {

  var patches = _.clone(Quilt.patches);

  module('View', {

    setup: function() {
      Quilt.patches = patches;
    }

  });

  test('Collection and Model events are cleaned up on dispose.', 0, function() {
    var model = new Backbone.Model;
    var collection = new Backbone.Collection;
    var view = new Quilt.View({model: model, collection: collection});
    view.listenTo(model, 'event', function(){ ok(false); });
    view.listenTo(collection, 'event', function() { ok(false); });
    view.dispose();
    model.trigger('event');
    collection.trigger('event');
  });

  test('Child views are disposed of.', 1, function() {
    var parent = new Quilt.View;
    var child = new Quilt.View;
    child.dispose= function() {
      ok(this === child);
    };
    parent.addView(child);
    parent.dispose();
  });

  test('Dashes are inserted into data attributes.', 2, function() {
    Quilt.patches.testAttr = function(el, options) {
      strictEqual(options, 'test');
      ok($(el).is('p'));
    };
    var view = new Quilt.View;
    view.template = function() {
      return '<p data-test-attr="test"></p>';
    };
    view.render();
  });

  test('Other data attributes are ignored.', 1, function() {
    Quilt.patches.exists = function() {
      ok(true);
    };
    var view = new Quilt.View;
    view.template = function() {
      return '<p data-exists="true" data-doesnt="false"></p>';
    };
    view.render();
  });

  test('Tolerate non-view return from attribute function.', 0, function() {
    Quilt.patches.test = function() { return {}; };
    var view = new Quilt.View({model: new Backbone.Model});
    view.template = function() { return '<p data-test="true"></p>'; };
    view.render();
  });

  test('Dispose is chainable.', 1, function() {
    var view = new Quilt.View;
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
    var view = new Quilt.View;
  });

  test('Render disposes old child views.', 1, function() {
    var view = new Quilt.View;
    var child = new Quilt.View;
    child.dispose = function() { ok(true); };
    view.addView(child);
    view.render();
  });

  test('addView', 1, function() {
    var view = new Quilt.View;
    var child = new Quilt.View;
    view.addView(child);
    ok(view.views[0] === child);
  });

  test('renderView', 2, function() {
    var view = new Quilt.View;
    var View = Quilt.View.extend({
      render: function() {
        ok(true);
        return this;
      }
    });
    var child = new View;
    view.renderView(child);
    ok(view.views[0] === child);
  });

})();
