(function($, Backbone, Kinetic) {

  var View = Kinetic.View;
  var Model = Backbone.Model;
  var truncate = $.truncate;

  module('Content', {

    setup: function() {
      $.truncate = truncate;
    }

  });

  test('data-html sets html.', function() {
    var model = new Model({test: '<b>test</b>'});
    var view = new View({model: model});
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
    var model = new Model({test: '<b>test</b>'});
    var view = new View({model: model});
    view.template = function() {
      return '<p data-text="test"></p>';
    };
    view.render();
    var p = view.$('p');
    strictEqual(p.text(), '<b>test</b>');
    model.set({test: '<i>test</i>'});
    strictEqual(p.text(), '<i>test</i>');
  });

  test('Use truncate if available.', 2, function() {
    var model = new Model({test: 'test'});
    var view = new View({model: model});
    view.template = function() {
      return '<p data-html=\'{"attr": "test", "truncate": 25}\'></p>';
    };
    $.truncate = function(html, options) {
      strictEqual(html, 'test');
      strictEqual(options, 25);
    };
    view.render();
  });

})(jQuery, Backbone, Kinetic);
