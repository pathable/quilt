define ->

  # Save model on submit, populate fields on render.
  Quilt.attributes.form = (el, options) ->
    new Form {el, @model, @collection}

  # Will a form submit when clicking a 'button:not([type=submit])'?
  buttonSubmit = (->
    submitted = false
    $('<form><button></button></form>').submit (e) ->
      e.preventDefault()
      submitted = true
    .find('button').click()
    submitted
  )()

  class Form extends Quilt.View

    tagName: 'form'

    events:

      submit: 'save'

      'click button': (e) ->
        @$el.submit() unless buttonSubmit or e.target.type is 'submit'

      'focus input': (e) ->
        @$("[data-form-tip=#{e.target.name}]").removeClass('hide')

      'blur input': (e) ->
        @$("[data-form-tip=#{e.target.name}]").addClass('hide')

    initialize: (options) ->
      super
      @model?.on('syncing', @disable, @)
      @model?.on('sync error', @enable, @)
      @model?.on('sync error', @render, @)
      @model?.on('sync', @render, @)
      @model?.on('error', @error, @)

    save: (e) ->
      e?.preventDefault()
      return if @disabled
      @model.save @serialize(),
        wait: true
        success: =>
          window.location = r if r = @$el.data('formRedirect')

    error: (model, xhr, options) ->
      return unless xhr.status is 422
      for attr, value of JSON.parse(xhr.responseText)
        try
          label = @$("[data-label=#{attr}]")
          label.find('[data-form-error]').remove()
          label.addClass('error')
          label.append("<span data-form-error> #{value}</span>")
        catch e
          console.log "Could not add error to #{attr}", e

    render: ->

      # Set form values.
      for attr, value of @model?.attributes
        inputs = @$(":input[name=#{attr}]")
        if inputs.is('[data-form-bool]')
          inputs.prop('checked', !!value)
        else
          value = [value] if inputs.is(':radio') and !_.isArray(value)
          inputs.val(value)

      # Reset errors.
      @$('label').removeClass('error')
      @$('[data-form-error]').remove()

      # Placeholder for legacy browsers
      @$('input[placeholder], textarea[placeholder]').placeholder()

      # Hook up labels.
      names = _.groupBy @$('[data-label]'), (el) -> $(el).data('label')
      for name, labels of names
        inputs = @$("[name=#{name}]")
        for label, i in labels
          $label = $(label)
          if (input = inputs[i])?
            $label.attr for: input.id or= "#{name}-label-#{@cid}-#{i}"
          if _.isEmpty $(label).text()
            $label.text name.capitalize()

      # Hide tips.
      @$('[data-form-tip]').addClass('hide')

      @

    # Serialize the form as a JSON object, creating arrays for duplicate
    # attribute names.
    serialize: ->
      attrs = {}

      # Serialize generic fields.
      for {name, value} in @$el.serializeArray()
        if _.has(attrs, name)
          attrs[name] = [attrs[name]] unless _.isArray(attrs[name])
          attrs[name].push(value)
        else
          attrs[name] = value

      # Serialize boolean check boxes.
      for el in @$(':checkbox[data-form-bool]')
        attrs[el.name] = el.checked

      attrs

    disable: ->
      @disabled = true
      @$(':submit,:button').prop('disabled', true)

    enable: ->
      @disabled = false
      @$(':submit,:button').prop('disabled', false)
