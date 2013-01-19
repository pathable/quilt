define [
  'coffee!ui/form'
], (Form) ->

  module('form')

  test 'Set value of text input.', 1, ->
    view = new Form
      model: new Backbone.Model(x: 1)
      el: "<form><input type='text' name='x'></form>"
    .render()
    strictEqual(view.$('input').val(), '1')

  test 'Set null value.', 1, ->
    view = new Form
      model: new Backbone.Model(x: null)
      el: "<form><input type='text' name='x'></form>"
    .render()
    strictEqual(view.$('input').val(), '')

  test 'Set password field.', 1, ->
    view = new Form
      model: new Backbone.Model(x: 1)
      el: "<form><input type='password' name='x'></form>"
    .render()
    strictEqual(view.$('input').val(), '1')

  test 'Set textarea value.', 1, ->
    view = new Form
      model: new Backbone.Model(x: 1)
      el: "<form><textarea name='x'></textarea></form>"
    .render()
    strictEqual(view.$('textarea').val(), '1')

  test 'Set radio values.', 1, ->
    view = new Form
      model: new Backbone.Model(x: 1)
      el: """
        <form>
          <input type='radio' name='x' value='0'>
          <input type='radio' name='x' value='1'>
          <input type='radio' name='x' value='2'>
        </form>
      """
    .render()
    deepEqual(_.pluck(view.$(':checked'), 'value'), ['1'])

  test 'Set select value.', 1, ->
    view = new Form
      model: new Backbone.Model(x: 1)
      el: """
        <form>
          <select name='x'>
            <option value='0'>0</option>
            <option value='1'>1</option>
            <option value='2'>2</option>
          </select>
        </form>
      """
    .render()
    strictEqual(view.$('select').val(), '1')

  test 'Set checkbox values.', 1, ->
    view = new Form
      model: new Backbone.Model(x: [1, 3])
      el: """
        <form>
          <input type='checkbox' name='x' value='0'>
          <input type='checkbox' name='x' value='1'>
          <input type='checkbox' name='x' value='2'>
          <input type='checkbox' name='x' value='3'>
        </form>
      """
    .render()
    deepEqual(_.pluck(view.$(':checked'), 'value'), ['1', '3'])

  test 'Save on submit', 2, ->
    view = new Form
      model: new Backbone.Model
      el: """
        <form>
          <input type='text' name='x' value='1'>
        </form>
      """
    .render()
    view.model.save = (attrs, options) ->
      deepEqual(attrs, {x: '1'})
      ok(options.wait)
    view.$el.trigger('submit')

  test 'Serialize text fields correctly.', 1, ->
    view = new Form
      model: new Backbone.Model
      el: "<form><input type='text' name='x' value='1'></form>"
    .render()
    deepEqual(view.serialize(), {x: '1'})

  test 'Serialize checkboxes correctly.', 1, ->
    view = new Form
      model: new Backbone.Model
      el: """
        <form>
          <input type='checkbox' name='x' value='0' checked>
          <input type='checkbox' name='x' value='1'>
          <input type='checkbox' name='x' value='2' checked>
          <input type='checkbox' name='x' value='3'>
        </form>
      """
    .render()
    deepEqual(view.serialize(), {x: ['0', '2']})

  test ':button:not([type=submit])', 1, ->
    View = Form.extend
      save: (e) ->
        e.preventDefault()
        ok(true)
    view = new View
      model: new Backbone.Model
      el: '<form><button></button></form>'
    .render()
    view.$('button').trigger('click')

  test ':button[type=submit]', 1, ->
    View = Form.extend
      save: (e) ->
        e.preventDefault()
        ok(true)
    view = new View
      model: new Backbone.Model
      el: "<form><button type='submit'></button></form>"
    .render()
    view.$('button').trigger('click')

  test 'Disable buttons during sync.', 4, ->
    view = new Form
      model: new Backbone.Model
      el: """
        <form>
          <input type='submit'>
          <button></button>
        </form>
      """
    .render()
    view.model.trigger('syncing')
    ok(view.$('input').prop('disabled'))
    ok(view.$('button').prop('disabled'))
    view.model.trigger('sync')
    ok(!view.$('input').prop('disabled'))
    ok(!view.$('button').prop('disabled'))

  test 'Set label for attribute.', 1, ->
    view = new Form
      model: new Backbone.Model
      el: """
        <form>
          <label data-label='x'></label>
          <input name='x'>
        </form>
      """
    .render()
    ok view.$('label').attr('for') is view.$('input')[0].id

  test 'Set existing label for attribute.', 2, ->
    view = new Form
      model: new Backbone.Model
      el: """
        <form>
          <label data-label='x'></label>
          <input name='x' id='x'>
        </form>
      """
    .render()
    ok view.$('label').attr('for') is 'x'
    ok view.$('input')[0].id is 'x'

  test 'Set boolean checkboxes.', 1, ->
    view = new Form
      model: new Backbone.Model(x: true)
      el: """
        <form>
          <input data-form-bool type='checkbox' name='x'>
        </form>
      """
    .render()
    ok view.$('input')[0].checked

  test 'Set boolean checkboxes.', 1, ->
    view = new Form
      model: new Backbone.Model(x: false)
      el: """
        <form>
          <input data-form-bool type='checkbox' name='x' checked>
        </form>
      """
    .render()
    ok !view.$('input')[0].checked

  test 'Serialize boolean checkboxes.', 2, ->
    view = new Form
      model: new Backbone.Model
      el: """
        <form>
          <input data-form-bool type='checkbox' name='x' checked>
        </form>
      """
    .render()
    deepEqual view.serialize(), {x: true}
    view.$('input').prop('checked', false)
    deepEqual view.serialize(), {x: false}

  test 'Labels for multiple elements.', 2, ->
    view = new Form
      model: new Backbone.Model
      el: """
        <form>
          <label data-label='x'>
            <input type='checkbox' name='x' value='1'>
          </label>
          <label data-label='x'>
            <input type='checkbox' name='x' value='2'>
          </label>
          <label data-label='x'>
            <input type='checkbox' name='x' value='3'>
          </label>
        </form>
      """
    .render()
    ids = _.pluck(view.$('input'), 'id')
    strictEqual _.uniq(ids).length, 3
    deepEqual ids, _.map(view.$('label'), (label) -> $(label).attr('for'))

  test 'Labels for missing elements do not throw.', 0, ->
    view = new Form
      model: new Backbone.Model
      el: """
        <form>
          <label data-label='x'></label>
        </form>
      """
    .render()

  test 'Show form tips appropriately.', 3, ->
    view = new Form
      model: new Backbone.Model
      el: """
        <form>
          <input type='text' name='x'>
          <p data-form-tip='x'></p>
        </form>
      """
    .render()
    ok view.$('p').hasClass('hide')
    view.$('input').focus()
    ok !view.$('p').hasClass('hide')
    view.$('input').blur()
    ok view.$('p').hasClass('hide')
