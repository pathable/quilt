define ->

  # data-src
  #
  # <img data-src='attr'>
  # <img data-src='{"attr": "attr", "model": "@model"}'>
  # <img data-src='{"prop": "prop"}'>
  Quilt.attributes.src = (el, options = {}) ->
    options = {attr: options} if _.isString(options)
    options.el = el
    options.model = @model
    new Src(options)

  # Render the specified attribute as src.
  class Src extends Quilt.View

    initialize: (options) ->
      {@attr, @prop} = options
      @render()
      @model?.on('change', @change, @) if @attr

    change: ->
      @render() if @model?.hasChanged(@attr)

    render: ->
      return @ unless @model
      value = if @prop?
        _.result(@model, @prop)
      else if @attr?
        @model.get(@attr) or ''

      @$el.attr('src', value)
      @
