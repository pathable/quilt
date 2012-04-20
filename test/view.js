(function($, Backbone, Kinetic) {

  var View = Kinetic.View;
  var Model = Backbone.Model;
  var Collection = Backbone.Collection;

  module('View');

  test('Views are removed on destroy.', function() {
    var view = new View();
    var container = $('<div></div>')[0];
    view.render().$el.appendTo(container);
    view.destroy();
    ok(view.$el.parent()[0] !== container);
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

})(jQuery, Backbone, Kinetic);
