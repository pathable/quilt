(function($) {

  var View = Kinetic.View;
  var Toggle = Kinetic.Toggle;
  var Model = Backbone.Model;

  var show = Kinetic.attributes.show;
  var hide = Kinetic.attributes.hide;

  module('Toggle');

  test('Show attribute.', function() {
    var parent = new View({model: new Model()});
    parent._model = new Model();
    var el = $('<p></p>')[0];

    var view = show.call(parent, el, 'attr');
    ok(view instanceof Toggle);
    ok(!view.invert);
    ok(view.el === el);
    strictEqual(view.attr, 'attr');
    ok(view.model === parent.model);

    view = show.call(parent, el, {attr: 'attr', model: '@_model'});
    ok(view instanceof Toggle);
    ok(view.el === el);
    ok(!view.invert);
    strictEqual(view.attr, 'attr');
    ok(view.model === parent._model);
  });

  test('Hide attribute.', function() {
    var parent = new View({model: new Model()});
    parent._model = new Model();
    var el = $('<p></p>')[0];

    var view = hide.call(parent, el, 'attr');
    ok(view instanceof Toggle);
    ok(view.invert);
    ok(view.el === el);
    strictEqual(view.attr, 'attr');
    ok(view.model === parent.model);

    view = hide.call(parent, el, {attr: 'attr', model: '@_model'});
    ok(view instanceof Toggle);
    ok(view.el === el);
    ok(view.invert);
    strictEqual(view.attr, 'attr');
    ok(view.model === parent._model);
  });

  test('Show content.', function() {
    var view = new Toggle({
      attr: 'attr',
      invert: false,
      el: $('<p></p>'),
      model: new Model({attr: false})
    }).render();
    ok(view.$el.hasClass('hide'));
    view.model.set({attr: true});
    ok(!view.$el.hasClass('hide'));
    view.model.set({attr: false});
    ok(view.$el.hasClass('hide'));
  });

  test('Hide content.', function() {
    var view = new Toggle({
      attr: 'attr',
      invert: true,
      el: $('<p></p>'),
      model: new Model({attr: true})
    }).render();
    ok(view.$el.hasClass('hide'));
    view.model.set({attr: false});
    ok(!view.$el.hasClass('hide'));
    view.model.set({attr: true});
    ok(view.$el.hasClass('hide'));
  });

  test('Null model does not throw.', 0, function() {
    new Toggle({attr: 'attr', el: $('<p></p>')}).render();
  });

})(jQuery);

