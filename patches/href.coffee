define ->

  # data-href
  #
  # <a data-href='prop'> // uses model property
  # <a data-href='{"prop": "prop"}'> // uses model property
  # <a data-href='{"attr": "attr"}'> // uses model attrbute
  Quilt.attributes.href = (el, options = {}) ->
    options = {prop: options} if _.isString(options)
    options.el = el
    options.model = @model
    new Href(options)

  # Render the specified property or attribute as href.
  class Href extends Quilt.View

    initialize: (options) ->
      {@attr, @prop} = options
      @render()
      @model?.on('change', @change, @)

    change: ->
      @render() if @model?.hasChanged(@attr or 'id')

    render: ->
      return @ unless @model
      value = if @prop?
        _.result(@model, @prop)
      else if @attr?
        @model.get(@attr)
      @$el.attr('href', value or '#')
      @
