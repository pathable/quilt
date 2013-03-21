define ->

  Quilt.attributes.focus = (el, options = {}) ->
    new Focus(el: el, model: @model)

  class Focus extends Quilt.View

    render: ->
      setTimeout => @$el.focus()
      @
