(function() {

  module('ref');

  test('data-ref creates a reference.', function() {
    var view = new Quilt.View;
    var p = $('p')[0];
    Quilt.patches.ref.call(view, p, 'p');
    ok(view.$p instanceof $);
    ok(view.$p[0] === p);
  });

})();
