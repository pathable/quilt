(function(_, $, Backbone, Kinetic) {

  var View = Kinetic.View;
  var Model = Backbone.Model;
  var Collection = Backbone.Collection;

  var attrs = _.clone(Kinetic.attrs);

  module('View', {

    setup: function() {
      delete Kinetic.selector;
      Kinetic.attrs = attrs;
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

  test('data-ref', function() {
    var view = new View();
    view.template = function() {
      return '<p data-ref="1"></p><div><b data-ref="2"></b></div>';
    };
    view.render();
    ok(view.$1[0] === view.$('p')[0]);
    ok(view.$2[0] === view.$('b')[0]);
  });

  test('Dashes are inserted into data attributes.', 2, function() {
    Kinetic.attrs.testAttr = function(el, options) {
      strictEqual(options, 'test');
      ok($(el).is('p'));
    };
    var view = new View();
    view.template = function() {
      return '<p data-test-attr="test"></p>';
    };
    view.render();
  });

})(_, jQuery, Backbone, Kinetic);
