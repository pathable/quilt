(function($) {

  var List = Kinetic.List;
  var Model = Backbone.Model;
  var Collection = Backbone.Collection;

  var c = null;
  var m = null;
  var list = null;
  var m1 = new Model({id: 1});
  var m2 = new Model({id: 2});
  var m3 = new Model({id: 3});

  module('List', {

    setup: function() {
      Kinetic.templates.empty = _.template('');
      m = new Model({id: 4});
      c = new Collection([m1, m2]);
      list = new List({
        el: '<div><div></div></div>',
        collection: c,
        template: {name: 'empty'}
      }).render();
    }

  });

  test('Create views from collection.', function() {
    strictEqual(list.$el.children().length, 2);
    strictEqual(list.views.length, 2);
    ok(list.views[0].model === m1);
    ok(list.views[1].model === m2);
    ok(list.findView(m1) === list.views[0]);
    ok(list.findView(m2) === list.views[1]);
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

})();
