(function($, Backbone, Kinetic) {

  var model;
  var view;
  var View = Kinetic.View;
  var Model = Backbone.Model;

  test('data-html sets html.', function() {
    model = new Model({test: '<b>test</b>'});
    view = new View({model: model});
    view.template = function() {
      return '<p data-html="test"></p>';
    };
    view.render();

    var p = view.$('p');
    strictEqual(p.html(), '<b>test</b>');
    model.set({test: '<i>test</i>'});
    strictEqual(p.html(), '<i>test</i>');

    view.render();
    p = view.$('p');
    strictEqual(p.html(), '<i>test</i>');
    model.set({test: '<b>test</b>'});
    strictEqual(p.html(), '<b>test</b>');
  });

  test('data-text sets text.', function() {
    model = new Model({test: '<b>test</b>'});
    view = new View({model: model});
    view.template = function() {
      return '<p data-text="test"></p>';
    };
    view.render();
    var p = view.$('p');
    strictEqual(p.text(), '<b>test</b>');
    model.set({test: '<i>test</i>'});
    strictEqual(p.text(), '<i>test</i>');
  });

})(jQuery, Backbone, Kinetic);
