define [
  'coffee!ui/href'
], (Href) ->

  {Model} = Backbone
  {View} = Quilt

  module('Href')

  test 'should work with props', ->
    parent = new View
      model: new Model()
    el = $('<p></p>')[0]

    view = Quilt.attributes.href.call(parent, el, 'prop')
    ok(view instanceof Href)
    ok(view.el is el)
    strictEqual(view.prop, 'prop')
    ok(view.model is parent.model)

    view = Quilt.attributes.href.call parent, el,
      prop: 'prop'
    ok(view instanceof Href)
    ok(view.el is el)
    strictEqual(view.prop, 'prop')

  test 'should work with attributes', ->
    view = new Href
      attr: 'attr'
      el: $('<p></p>')
      model: new Model(attr: '#route/1')
    strictEqual(view.attr, 'attr')
    strictEqual(view.$el.attr('href'), '#route/1')

  test 'should default to hash', ->
    view = new Href
      prop: 'prop'
      el: $('<p></p>')
      model: new Model()
    strictEqual(view.$el.attr('href'), '#')

  test 'Render href.', ->
    model = new Model()
    model.prop = ->'#route/1'

    view = new Href
      prop: 'prop'
      el: $('<p></p>')
      model: model
    strictEqual(view.$el.attr('href'), '#route/1')

    test 'Null model does not throw.', 0, ->
    view = new Href
      prop: 'prop'
      el: $('<p></p>')
    view.render()
