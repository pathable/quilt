(function() {

  module('attrs');

  test('data-attrs', function() {
    var view = new Quilt.View({
      el: '<p><i data-attrs=\'{"title": "title"}\'></i></p>',
      model: new Backbone.Model({title: 'x'})
    }).render();
    strictEqual(view.$('i').attr('title'), 'x');
    view.model.set({title: 'y'});
    strictEqual(view.$('i').attr('title'), 'y');
  });

  test('data-props', function() {
    var view = new Quilt.View({
      el: '<p><input type="checkbox" data-props=\'{"checked": "checked"}\'></p>',
      model: new Backbone.Model({checked: true})
    }).render();
    ok(view.$('input').prop('checked'));
    view.model.set({checked: false});
    ok(!view.$('input').prop('checked'));
  });

  test('data-css', function() {
    var view = new Quilt.View({
      el: '<p><i data-css=\'{"color": "color"}\'></i></p>',
      model: new Backbone.Model({color: 'blue'})
    }).render();
    ok(view.$('i').css('color'), 'blue');
    view.model.set({color: 'green'});
    ok(view.$('i').css('color'), 'green');
  });

})();
