define ->

  # Show content if `attr` is true, hide it otherwise.
  Quilt.attributes.show = (el, options) ->
    new Show
      el: el
      attr: options
      model: @model
      collection: @collection

  # Hide content if `attr` is true, show it otherwise.
  Quilt.attributes.hide = (el, options) ->
    new Show
      el: el
      invert: true
      attr: options
      model: @model
      collection: @collection


  # # Toggle
  # Toggle content based on the value of a specific attribute.
  class Show extends Quilt.View

    initialize: (options) ->
      super
      {@attr, @invert} = options
      @model?.on("change:#{@attr}", @render, @)
      @collection?.on("sync", @render, @)

    render: ->
      if @model?
        value = @model.get(@attr)
      else if @collection?
        value = not @collection.isEmpty()
      else
        return
      @$el.toggleClass('hide', if @invert then !!value else !value)
      @
