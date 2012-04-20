(function($, Backbone, Kinetic) {

  var View = Kinetic.View;
  var Model = Backbone.Model;
  var Collection = Backbone.Collection;

  module('Templates', {

    setup: function() {
      Kinetic.templates = {};
    }

  });

  test('Render template.', function() {
    Kinetic.templates.test = _.template('<p><%= model.get("content") %></p>');
    var model = new Model({content: 'test'});
    var view = new View({model: model});
    view.template = function() {
      return '<div data-template="test"></div>';
    };
    view.render();
    strictEqual(view.$('div').html(), '<p>test</p>');
  });

  test('Render recursively.', function() {
    Kinetic.templates = {
      outer: _.template('<p data-template="inner"></p>'),
      inner: _.template('<%= model.get("content") %>')
    };
    var model = new Model({content: 'test'});
    var view = new View({model: model});
    view.template = function() {
      return '<div data-template="outer"></div>';
    };
    view.render();
    strictEqual(view.$('div').html(), '<p data-template="inner">test</p>');
  });

  test('Render a different model.', function() {
    Kinetic.templates.test = _.template('<%= model.get("x") %>');
    var model = new Model();
    model.test = new Model({x: 1});
    var view = new View({model: model});
    view.template = function() {
      return '<p data-template=\'{"name": "test", "model": "test"}\'></p>';
    };
    view.render();
    strictEqual(view.$('p').html(), '1');
  });

})(jQuery, Backbone, Kinetic);
