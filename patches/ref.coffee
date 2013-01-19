define ->

  Quilt.attributes.ref = (el, options) ->
    @['$' + options] = $(el)
