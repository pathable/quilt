define ->

  # This basic patch applies to any element with data-ref="". It's common to
  # attach to DOM elements using class selectors. This is brittle and conflates
  # the concerns of UI style and application structure. this patch
  # provides a distinct way to reference DOM elements scoped to the current view.
  Quilt.attributes.ref = (el, options) ->
    @['$' + options] = $(el)
