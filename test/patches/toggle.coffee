define [
  'coffee!ui/toggle'
], (Toggle) ->

  module('Toggle')

  test 'toggle attribute', ->
    el = $('<div></div>')[0]
    view = Quilt.patches.toggle(el)
    ok(view instanceof Toggle)
    ok(view.el is el)

  test 'toggle correctly parses content and options', ->
    view = Quilt.patches.toggle($("""
      <div data-toggle>
        <div data-toggle-hide></div>
        <div data-toggle-show></div>
        <div data-toggle-content class="hide"></div>
      </div>
    """)[0]).render()
    ok(view.$content.length is 1, 'view should have one content element')
    ok(!view.$show.hasClass('hide'), 'when content is hidden the show control should be visible')
    ok(view.$hide.hasClass('hide'), 'when content is hidden the hide control should not be visible')

    view = Quilt.patches.toggle($("""
      <div data-toggle>
        <div data-toggle-hide></div>
        <div data-toggle-show></div>
        <div data-toggle-content></div>
      </div>
    """)[0]).render()
    ok(view.$show.hasClass('hide'), 'when content is visible the show control should not be visible')
    ok(!view.$hide.hasClass('hide'), 'when content is visible the hide control should be visible')
    ok(!view.$content.hasClass('hide'), 'when content is visible the content should be visible')

  test 'toggle control shows and hides content', ->
    view = Quilt.patches.toggle($("""
      <div data-toggle>
        <div data-toggle-hide></div>
        <div data-toggle-show></div>
        <div data-toggle-content class="hide"></div>
      </div>
    """)[0]).render()

    view.$show.click()
    ok(!view.$content.hasClass('hide'), 'clicking show control shows content')
    ok(view.$show.hasClass('hide'), 'clicking show control hides show control')
    ok(!view.$hide.hasClass('hide'), 'clicking show control shows hide control')

    view.$hide.click()
    ok(view.$content.hasClass('hide'), 'clicking hide control hides content')
    ok(!view.$show.hasClass('hide'), 'clicking hide control shows show control')
    ok(view.$hide.hasClass('hide'), 'clicking hide control hides hide control')
