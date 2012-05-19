(function($) {

  var List = Kinetic.List;
  var View = Kinetic.View;
  var Model = Backbone.Model;
  var Collection = Backbone.Collection;

  var templates = Kinetic.templates;

  var c = null;
  var m = null;
  var list = null;
  var m1 = new Model({id: 1});
  var m2 = new Model({id: 2});
  var m3 = new Model({id: 3});

  module('List', {

    setup: function() {
      Kinetic.templates = {
        id: function(data){
          return '' + data.model.id;
        }
      };

      m = new Model({id: 4});
      c = new Collection([m1, m2]);

      list = new List({
        el: $('<ul><li data-item="id"></li></ul>'),
        collection: c
      }).render();
    },

    teardown: function() {
      Kinetic.templates = templates;
    }

  });

  test('Attribute', function() {
    var parent = new View({model: new Model(), collection: new Collection()});
    parent._model = new Model();
    parent._collection = new Collection();
    var el = $('<p></p>')[0];

    var view = Kinetic.attributes.list.call(parent, el);
    ok(view instanceof List);
    ok(view.el === el);
    ok(view.model === parent.model);
    ok(view.collection === parent.collection);

    view = Kinetic.attributes.list.call(parent, el, {
      model: '@_model',
      collection: '@_collection'
    });
    ok(view instanceof List);
    ok(view.el === el);
    ok(view.model === parent._model);
    ok(view.collection === parent._collection);
  });

  test('Create views from collection.', function() {
    strictEqual(list.$el.children().length, 2);
    strictEqual(list.views.length, 2);
    ok(list.views[0].model === m1);
    ok(list.views[1].model === m2);
    ok(list.findView(m1) === list.views[0]);
    ok(list.findView(m2) === list.views[1]);
    strictEqual(list.findView(m1).$el.html(), '1');
    strictEqual(list.findView(m2).$el.html(), '2');
  });

  test('Add a model.', function() {
    c.add(m);
    strictEqual(list.views.length, 3);
    var view = list.findView(m.cid);
    ok(view.model === m);
    ok(list.findView(m.cid) === view);
    ok(list.findView(view.cid) === view);
    m.set({id: 50});
    ok(list.findView(50) === view);
    c.add(m);
    strictEqual(list.views.length, 3);
  });

  test('Insert elements in order.', function() {
    c.comparator = function(model) { return model.id; };
    c.add(m3);
    var $el = list.findView(3).$el;
    ok($el.is(':nth-child(3)'));
    ok($el.parent().is(list.el));
    c.add({id: -5});
    $el = list.findView(-5).$el;
    ok($el.is(':nth-child(1)'));
    ok($el.parent().is(list.el));
    c.add({id: -1});
    $el = list.findView(-1).$el;
    ok($el.is(':nth-child(2)'));
    ok($el.parent().is(list.el));
  });

  test('Remove a model.', 5, function() {
    var view = list.findView(m1);
    view.destroy = function() { ok(true); };
    c.remove(m1);
    strictEqual(list.views.length, 1);
    ok(!list.findView(1));
    ok(!list.findView(m1.cid));
    ok(!list.findView(view.cid));
  });

  test('Reset', function() {
    strictEqual(list.views.length, 2);
    c.reset([m2, m3]);
    strictEqual(list.views.length, 2);
    ok(!list.findView(m1));
    ok(list.findView(m2).model === m2);
    ok(list.findView(m3).model === m3);
  });

  test('Keep views through reset.', function() {
    var view = list.findView(m2);
    c.reset([m2]);
    ok(list.findView(m2) === view);
  });

  test('Reorder views after reset.', function() {
    c.reset([m2, m1]);
    ok(list.views[0].model === m2);
    ok(list.views[1].model === m1);
  });

})(jQuery);
