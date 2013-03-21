define ->

  # # data-toggle
  #
  #    <div data-toggle>
  #      <span data-toggle-show>Show some stuff</span>
  #      <span data-toggle-hide>Hide some stuff</span>
  #      <div data-toggle-content>
  #        ...
  #      </div>
  #    </div>

  Quilt.attributes.toggle = (el, options) ->
    new Toggle(el: el)

  class Toggle extends Quilt.View

    events:

      'click [data-toggle-show],[data-toggle-hide]': (e) ->
        e.stopPropagation()
        @$content.toggleClass('hide')
        @render()

    initialize: ->
      @$content = @$('[data-toggle-content]')
      @$hide = @$('[data-toggle-hide]')
      @$show = @$('[data-toggle-show]')
      @

    render: ->
      hidden = !!@$content.hasClass('hide')
      @$hide.toggleClass('hide', hidden)
      @$show.toggleClass('hide', !hidden)
      @
