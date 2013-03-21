define ->

  # data-date
  #
  # <time data-date='attr'></time>
  # <time data-date='{"attr": "attr", "format": "...", "model": "@model"}'>
  # </time>
  Quilt.attributes.date = (el, options = {}) ->
    options = {attr: options} if _.isString(options)
    options.el = el
    options.model = @model
    new DateView(options)

  class DateView extends Quilt.View

    initialize: (options) ->
      {@attr, @format} = options
      @model?.on('change', @change, @)

    change: ->
      @render() if @model?.hasChanged(@attr)

    render: ->
      return @ unless moment? and @model?
      value = @model.get(@attr)
      if value?
        value = moment(value)
        value = if @format? then value.format(@format) else value.fromNow()
        @$el.text(value)
      else
        @$el.empty()
      @
