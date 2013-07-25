(function() {

  module('add and remove');

  test('data-if', function() {
    var view = new Quilt.View({
      template: function(){
        return '<p><i data-if="x"></i></p>';
      },
      model: new Backbone.Model({x: true})
    }).render();
    ok(view.$('i').length > 0)
    view.model.set({x: false});
    ok(view.$('i').length == 0)
  });

  test('missing model', 0, function() {
    new Quilt.View({
      template: function() {
        return '<p><i data-hide="x"></i></p>';
      }
    }).render();
  });

})();
