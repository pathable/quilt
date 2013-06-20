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
        return '<p><i data-css=\'{"color": "color"}\'></i></p>';
      },
      model: new Backbone.Model({color: 'blue'})
    }).render();
    strictEqual(view.$('i').css('color'), 'blue');
    view.model.set({color: 'green'});
    strictEqual(view.$('i').css('color'), 'green');
  });

  test('multiple attrs', function() {
    var view = new Quilt.View({
      template: function() {
        return '<p><i data-css=\'{"color": "color", "background": "background"}\'></i></p>';
      },
      model: new Backbone.Model({color: 'blue', background: 'white'})
    }).render();
    view.model.set({color: 'red', background: 'black'});
    strictEqual(view.$('i').css('color'), 'red');
    strictEqual(view.$('i').css('background'), 'black');
  });

  test('missing model', 0, function() {
    new Quilt.View({
      template: function() {
        return '<p><i data-attrs=\'{"title": "title"}\'></i></p>';
      }
    }).render();
  });

})();
