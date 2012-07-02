(function() {

  var View = Quilt.View;
  var Model = Backbone.Model;
  var Collection = Backbone.Collection;

  var attrs = _.clone(Quilt.attributes);

  module('View', {

    setup: function() {
      delete Quilt.selector;
      Quilt.attributes = attrs;
    }

  });

  test('Collection and Model events are cleaned up on destroy.', 0, function() {
    var model = new Model();
    var collection = new Collection();
    var view = new View({model: model, collection: collection});
    model.on('event', function() { ok(false); }, view);
    collection.on('event', function() { ok(false); }, view);
    view.destroy();
    model.trigger('event');
    collection.trigger('event');
  });

  test('Child views are destroyed on destroy.', 1, function() {
    var parent = new View();
    var child = new View();
    child.destroy = function() {
      ok(this === child);
    };
    parent.views.push(child);
    parent.destroy();
  });

  test('Dashes are inserted into data attributes.', 2, function() {
    Quilt.attributes.testAttr = function(el, options) {
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
    Quilt.attributes.exists = function() {
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
    Quilt.attributes.test = function() { return {}; };
    var view = new View({model: new Model()});
    view.template = function() { return '<p data-test="true"></p>'; };
    view.render();
  });

  test('Destroy is chainable.', 1, function() {
    var view = new View();
    ok(view.destroy() === view);
  });

  test('Destroy removes DOM listeners', 0, function() {
    var View = Quilt.View.extend({
      events: {click: 'click'},
      click: function(){ ok(false); }
    });
    new View().destroy().$el.click();
  });

})();
