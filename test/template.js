(function($) {

  var View = Kinetic.View;
  var Model = Backbone.Model;
  var Template = Kinetic.Template;
  var Collection = Backbone.Collection;

  var template = Kinetic.attributes.template;
  var templates = Kinetic.templates;

  module('Templates', {

    setup: function() {
      Kinetic.templates = templates;
    }

  });

  test('Attribute', function() {
    var parent = new View({model: new Model(), collection: new Collection()});
    parent._model = new Model();
    parent._collection = new Collection();
    var el = $('<p></p>')[0];

    var view = template.call(parent, el, 'name');
    ok(view instanceof Template);
    ok(view.el === el);
    strictEqual(view.name, 'name');
    ok(view.model === parent.model);
    ok(view.collection === parent.collection);

    view = template.call(parent, el, {
      name: 'name',
      model: '@_model',
      collection: '@_collection'
    });
    ok(view instanceof Template);
    ok(view.el === el);
    strictEqual(view.name, 'name');
    ok(view.model === parent._model);
    ok(view.collection === parent._collection);
  });

  test('Render a template.', 7, function() {
    var model = new Model();
    var collection = new Collection([model]);

    Kinetic.templates = {

      layout: function(data) {
        ok(data.view === view);
        ok(data.model === model);
        ok(data.collection === collection);
        return '[' + data.content + ']';
      },

      test: function(data) {
        ok(data.view === view);
        ok(data.model === model);
        ok(data.collection === collection);
        return 'html';
      }

    };

    var view = new Template({
      name: 'test',
      layout: 'layout',
      model: model,
      collection: collection
    });

    view.render();
    strictEqual(view.$el.html(), '[html]');
  });

})(jQuery);
