define ->

  # # data-form-toggle
  # Toggle a model attribute on or off, saving
  # Examples:
  #   <button class="btn" data-form-toggle='{"attr": "visibility", "on": "Show", "off": "Hide"}'></button>
  #   <button class="btn" data-form-toggle="visibility"></button>
  Quilt.attributes.formToggle = (el, options) ->
    options = {attr: options} if _.isString(options)
    options.el = el
    options.model = @model
    new FormToggle(options)

  class FormToggle extends Quilt.View

    events:
      'click': '_click'

    initialize: (options) ->
      {@attr, @on, @off} = options
      @model?.on('change', @_change, @)

    render: ->
      @$el.text if @model.get(@attr) then @_on() else @_off()

    _click: ->
      attrs = {}
      attrs[@attr] = !@model.get(@attr)
      @model.save attrs

    _change: ->
      @render() if @model?.hasChanged(@attr)

    _on: ->
      @on or "#{@attr.capitalize()} On"

    _off: ->
      @off or "#{@attr.capitalize()} Off"