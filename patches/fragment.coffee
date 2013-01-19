define ->

  # Set an appropriate href with root.  Trigger "route" on click.
  Quilt.attributes.fragment = (el, options) ->
    new Fragment
      el: el
      fragment: options.toString()
      root: Backbone.history?.options?.root or '/'

  class Fragment extends Quilt.View

    events:
      click: 'click'

    initialize: (options) ->
      super
      {@root, @fragment} = options

    render: ->
      @$el.attr(href: @root + @fragment)
      @

    click: (e) ->
      e.preventDefault()
      @$el.trigger('route', [@fragment])
