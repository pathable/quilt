(function($) {

  var View = Kinetic.View;
  var Html = Kinetic.Html;
  var Model = Backbone.Model;

  var html = Kinetic.attributes.html;
  var text = Kinetic.attributes.text;

  module('Html');

  test('Html attribute.', function() {
    var parent = new View({model: new Model()});
    parent._model = new Model();
    var el = $('<p></p>')[0];

    var view = html.call(parent, el, 'attr');
    ok(view instanceof Html);
    ok(!view.escape);
    ok(view.el === el);
    strictEqual(view.attr, 'attr');
    ok(view.model === parent.model);

    view = html.call(parent, el, {attr: 'attr', model: '@_model'});
    ok(view instanceof Html);
    ok(!view.escape);
    ok(view.el === el);
    strictEqual(view.attr, 'attr');
    ok(view.model === parent._model);
  });

  test('Text attribute.', function() {
    var parent = new View({model: new Model()});
    parent._model = new Model();
    var el = $('<p></p>')[0];

    var view = text.call(parent, el, 'attr');
    ok(view instanceof Html);
    ok(view.escape);
    ok(view.el === el);
    strictEqual(view.attr, 'attr');
    ok(view.model === parent.model);

    view = text.call(parent, el, {attr: 'attr', model: '@_model'});
    ok(view instanceof Html);
    ok(view.escape);
    ok(view.el === el);
    strictEqual(view.attr, 'attr');
    ok(view.model === parent._model);
  });

  test('Null attribute does not throw.', function() {
    var view = new Html({
      attr: 'attr',
      el: $('<p></p>'),
      model: new Model()
    });
    strictEqual(view.$el.html(), '');
  });

  test('Render html.', function() {
    var view = new Html({
      attr: 'attr',
      el: $('<p></p>'),
      model: new Model({attr: '<i>x</i>'})
    });
    strictEqual(view.$el.html(), '<i>x</i>');
  });

  test('Render html on change.', function() {
    var view = new Html({
      attr: 'attr',
      el: $('<p></p>'),
      model: new Model({attr: '<i>x</i>'})
    });
    strictEqual(view.$el.html(), '<i>x</i>');
    view.model.set({attr: '<i>y</i>'});
    strictEqual(view.$el.html(), '<i>y</i>');
  });

  test('Hide when empty', function() {
    var view = new Html({
      attr: 'attr',
      el: $('<p></p>'),
      model: new Model()
    });
    ok(view.$el.hasClass('hide'));
    view.model.set({attr: 'x'});
    ok(!view.$el.hasClass('hide'));
    view.model.unset('attr');
    ok(view.$el.hasClass('hide'));
  });

  test('Escape values.', function() {
    var view = new Html({
      escape: true,
      attr: 'attr',
      el: $('<p></p>'),
      model: new Model({attr: '<b>&</b>'})
    });
    strictEqual(view.$el.html(), '&lt;b&gt;&amp;&lt;/b&gt;');
  });

  test('Call toString on values', function() {
    var view = new Html({
      attr: 'attr',
      el: $('<p></p>'),
      model: new Model({
        attr: {
          toString: function(){ return 'value'; }
        }
      })
    });
    strictEqual(view.$el.html(), 'value');
  });

  test('Null model does not throw.', 0, function() {
    new Html({attr: 'attr', el: $('<p></p>')}).render();
  });

})(jQuery);
