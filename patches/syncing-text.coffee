define ->

  Quilt.attributes.destroying = (el, translate) ->
    new Sync {el, translate, @model, methods: ['delete']}

  Quilt.attributes.saving = (el, translate) ->
    new Sync {el, translate, @model, methods: ['create', 'update']}


  class Sync extends Quilt.View

    initialize: (options) ->
      super
      _.extend(@, _.pick(options, 'translate', 'methods')) if options?
      @model.on('syncing', @syncing, @)
      @model.on('sync error', @sync, @)

    syncing: (method, model, options) ->
      return unless method in @methods
      @original = @$el.text()
      @$el.text(P.community?.locales().t(@translate or @original) + '...')

    sync: ->
      @$el.text(@original)

    render: ->
      @
