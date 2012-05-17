(function(_, $, Backbone, Kinetic) {

  var View = Kinetic.View;
  var Model = Backbone.Model;
  var Collection = Backbone.Collection;

  var attrs = _.clone(Kinetic.attributes);

  module('View', {

    setup: function() {
      delete Kinetic.selector;
      Kinetic.attributes = attrs;
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
    Kinetic.attributes.testAttr = function(el, options) {
      strictEqual(options, 'test');
      ok($(el).is('p'));
    };
    var view = new View();
    view.template = function() {
      return '<p data-test-attr="test"></p>';
    };
    view.render();
  });

  test('Resolve properties.', function() {
    var view = new View();
    var y = {z: {}};
    view.x = {y: function(){ return y; }};
    strictEqual(view.resolve('@x'), view.x);
    strictEqual(view.resolve('@x.y'), y);
    strictEqual(view.resolve('@x.y.z'), y.z);
    strictEqual(view.resolve('Kinetic'), Kinetic);
    strictEqual(view.resolve(null), null);
    strictEqual(view.resolve(undefined), null);
  });

  test('Other data attributes are ignored.', 1, function() {
    Kinetic.attributes.exists = function() {
      ok(true);
    };
    var view = new View();
    view.template = function() {
      return '<p data-exists="true" data-doesnt="false"></p>';
    };
    view.render();
  });

  test('Non-views in view.views don\'t cause errors.', 0, function() {
    var view = new View();
    view.views.push({});
    view.destroy();
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
    Kinetic.attributes.test = function() { return {}; };
    var view = new View({model: new Model()});
    view.template = function() { return '<p data-test="true"></p>'; };
    view.render();
  });

})(_, jQuery, Backbone, Kinetic);
