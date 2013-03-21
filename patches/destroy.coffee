define ->

  Quilt.attributes.destroy = (el, options) ->
    new Destroy(el: el, model: @model)

  class Destroy extends Quilt.View

    events:

      click: (e) ->
        return false unless confirm('Are you sure?')
        @model.destroy()
        true