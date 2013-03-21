define ->

  Quilt.attributes.syncingShow = (el, translate) ->
    new Sync {el, @model, @collection}


  class Sync extends Quilt.View

    initialize: (options) ->
      super
      @model?.on('syncing', @syncing, @)
      @model?.on('sync error', @sync, @)
      @collection?.on('willFetch', @syncing, @)
      @collection?.on('sync error', @sync, @)

    syncing: (method, model, options) ->
      @$el.toggleClass 'hide', no

    sync: ->
      @$el.toggleClass 'hide', yes

    render: ->
      @sync()