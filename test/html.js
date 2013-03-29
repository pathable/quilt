(function() {

  module('html');

  test('data-html', function() {
    var view = new Quilt.View({
      el: '<p><i data-html="x"></i></p>',
      model: new Backbone.Model({x: 'x'})
    }).render();
    strictEqual(view.$('i').html(), 'x');
    view.model.set({x: 'y'});
    strictEqual(view.$('i').html(), 'y');
  });

  test('data-escape', function() {
    var view = new Quilt.View({
      el: '<p><i data-escape="x"></i></p>',
      model: new Backbone.Model({x: '1 < 2'})
    }).render();
    strictEqual(view.$('i').html(), '1 &lt; 2');
    view.model.set({x: 'stuff & nonsense'});
    strictEqual(view.$('i').html(), 'stuff &amp; nonsense');
  });

})();
