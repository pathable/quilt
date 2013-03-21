define [
  'coffee!ui/src'
], (Src) ->

  {Model} = Backbone

  module('Src')

  test 'data-src', ->
    parent = new Quilt.View
      model: new Model()
    el = $('<p></p>')[0]

    view = Quilt.attributes.src.call(parent, el, 'attr')
    ok(view instanceof Src)
    ok(view.el is el)
    strictEqual(view.attr, 'attr')
    ok(view.model is parent.model)

    view = Quilt.attributes.src.call parent, el,
      attr: 'attr'
    ok(view instanceof Src)
    ok(view.el is el)
    strictEqual(view.attr, 'attr')

  test 'Null value does not throw.', ->
    view = new Src
      attr: 'attr'
      el: $('<p></p>')
      model: new Model()
    strictEqual(view.$el.attr('src'), '')

  test 'Render src.', ->
    view = new Src
      attr: 'attr'
      el: $('<p></p>')
      model: new Model(attr: 'test.jpg')
    strictEqual(view.$el.attr('src'), 'test.jpg')

  test 'Render src on change.', ->
    view = new Src
      attr: 'attr'
      el: $('<p></p>')
      model: new Model(attr: 'test.jpg')
    strictEqual(view.$el.attr('src'), 'test.jpg')
    view.model.set(attr: 'test.png')
    strictEqual(view.$el.attr('src'), 'test.png')

  test 'Null model does not throw.', 0, ->
    view = new Src
      attr: 'attr'
      el: $('<p></p>')
    view.render()
