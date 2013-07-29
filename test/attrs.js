(function() {

  module('attrs');

  test('data-attrs', function() {
    var view = new Quilt.View({
      template: function() {
        return '<p><i data-attrs=\'{"title": "title"}\'></i></p>';
      },
      model: new Backbone.Model({title: 'x'})
    }).render();
    strictEqual(view.$('i').attr('title'), 'x');
    view.model.set({title: 'y'});
    strictEqual(view.$('i').attr('title'), 'y');
  });

  test('data-props', function() {
    var view = new Quilt.View({
      template: function() {
        return '<p><input type="checkbox" data-props=\'{"checked": "checked"}\'></p>';
      },
      model: new Backbone.Model({checked: true})
    }).render();
    ok(view.$('input').prop('checked'));
    view.model.set({checked: false});
    ok(!view.$('input').prop('checked'));
  });

  test('data-css', function() {
    var view = new Quilt.View({
      template: function() {
        return '<p><i data-css=\'{"display": "display"}\'></i></p>';
      },
      model: new Backbone.Model({display: 'block'})
    }).render();
    strictEqual(view.$('i').css('display'), 'block');
    view.model.set({display: 'inline'});
    strictEqual(view.$('i').css('display'), 'inline');
  });

  test('multiple attrs', function() {
    var view = new Quilt.View({
      template: function() {
        return '<p><i data-css=\'{"display": "display", "position": "position"}\'></i></p>';
      },
      model: new Backbone.Model({display: 'block', position: 'absolute'})
    }).render();
    view.model.set({display: 'inline', position: 'relative'});
    strictEqual(view.$('i').css('display'), 'inline');
    strictEqual(view.$('i').css('position'), 'relative');
  });

  test('missing model', 0, function() {
    new Quilt.View({
      template: function() {
        return '<p><i data-attrs=\'{"title": "title"}\'></i></p>';
      }
    }).render();
  });

})();
