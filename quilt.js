(function() {

  // Global object reference.
  var root = this;

  // Global export.
  var Quilt = root.Quilt = {};

  // Current library version.
  Quilt.VERSION = '0.0.1';

  // Find dashes in attribute names.
  var undasher = /-([a-z]|[0-9])/ig;

  // Identify data attributes.
  var dataAttr = /^data-/;

  // Camel case data attributes.
  var camel = function(match, letter) {
    return (letter + '').toUpperCase();
  };

  // # Quilt.View
  // Provide a structure for declaring functionality through data attributes.
  var View = Quilt.View = Backbone.View.extend({

    constructor: function(options) {
      if (options && options.template) this.template = options.template;
      Backbone.View.apply(this, arguments);
    },

    // After executing the template function, search the view for relevant
    // patches, match them with handlers and execute them.  If a handler
    // returns a view, store it for clean up.
    render: function() {

      // Dispose of old views.
      if (this.views) _.invoke(this.views, 'dispose');

      // Views without a template don't need to render patches.
      if (!this.template) return this;

      // Render the template.
      this.$el.html(this.template());

      // Get all the elements.
      var elements = this.$('*').get();

      // Execute the handler for each element/attr pair.
      for (var i = 0, il = elements.length; i < il; i++) {
        var el = elements[i];
        var attrs = el.attributes;

        for (var j = 0, jl = attrs.length; j < jl; j++) {
          var attr = attrs[j];

          // IE8 will enumerate unspecified attributes.
          if (!attr.specified) continue;

          // Bail unless we have a data attribute.
          var name = attr.name;
          if (!dataAttr.test(name)) continue;

          // Camel case and strip "data-".
          name = name.replace(dataAttr, '').replace(undasher, camel);

          // Bail on attributes with no corresponding patch.
          var patch = Quilt.patches[name];
          if (!patch) continue;

          // Execute the handler.
          var view = patch.call(this, el, $(el).data(name));

          // Render the view if appropriate.
          if (view instanceof View) this.renderView(view);
        }
      }

      return this;
    },

    addView: function(view) {
      if (!this.views) this.views = [];
      this.views.push(view);
    },

    renderView: function(view) {
      this.addView(view.render());
    },

    // Dispose of child views.
    dispose: function() {
      this.stopListening();
      this.undelegateEvents();
      if (this.views) _.invoke(this.views, 'dispose');
      return this;
    }

  });

  // # Quilt.patches
  //
  // Patch handlers should be specified in camel case.  The arguments to
  // each handler will be a DOM element and the value of the data attribute.
  // The handler will be called with the parent view as context.
  //
  //     Quilt.patches.exampleAttr = function(element, options) {
  //       // Called for elements with a "data-example-attr" attribute.
  //     };
  //
  var patches = Quilt.patches = {};

  // # ref
  //
  // Create a reference to a specific DOM element, accessible from the view
  // as '$' + name.

  patches.ref = function(el, name) {
    this['$' + name] = $(el);
  };

  // # Show
  //
  // Listen for changes to an attribute and show the element if the value is
  // truthy, hiding it otherwise.

  var Show = Quilt.Show = Quilt.View.extend({

    initialize: function(options) {
      if (!this.model) return;
      this.attr = options.attr;
      this.listenTo(this.model, 'change:' + this.attr, this.render);
    },

    render: function() {
      if (!this.model) return this;
      var value = this.model.get(this.attr);
      this.$el.toggleClass('hide', this.invert ? !!value : !value);
      return this;
    }

  });

  patches.show = function(el, attr) {
    return new Show({
      el: el,
      attr: attr,
      model: this.model
    });
  };

  // # Hide
  //
  // Listen for changes to an attribute and hide the element if the value is
  // truthy, showing it otherwise.

  var Hide = Quilt.Hide = Show.extend({invert: true});

  patches.hide = function(el, attr) {
    return new Hide({
      el: el,
      attr: attr,
      model: this.model
    });
  };

  // # Html
  //
  // Listen for changes to an attribute, updating the element's content with
  // it's value.

  var Html = Quilt.Html = Quilt.View.extend({

    value: function() {
      return this.model.get(this.attr);
    },

    initialize: function(options) {
      this.attr = options.attr;
      if (!this.model) return;
      this.listenTo(this.model, 'change:' + this.attr, this.render);
    },

    render: function() {
      if (!this.model) return this;
      this.$el.html(this.value());
      return this;
    }

  });

  patches.html = function(el, attr) {
    return new Html({
      el: el,
      attr: attr,
      model: this.model
    });
  };

  // # Text
  //
  // Listen for changes to an attribute, updating the element's content with
  // it's escaped value.

  var Text = Quilt.Text = Html.extend({

    value: function() {
      return this.model.escape(this.attr);
    }

  });

  patches.text = function(el, attr) {
    return new Text({
      el: el,
      attr: attr,
      model: this.model
    });
  };

  // # Attrs
  //
  // Listen for changes to attributes and update the element's attributes
  // accordingly.

  var Attrs = Quilt.Attrs = Quilt.View.extend({

    accessor: 'attr',

    initialize: function(options) {
      if (!this.model) return;
      _.each(_.keys(this.map = options.map), this.setAndListen, this);
    },

    setAndListen: function(target) {
      var source = this.map[target];
      var event = 'change:' + source;

      // Set initial value.
      this.$el[this.accessor](target, this.model.get(source));

      // Listen for changes.
      this.listenTo(this.model, event, function(model, value) {
        this.$el[this.accessor](target, value);
      });
    }

  });

  patches.attrs = function(el, attrs) {
    return new Attrs({
      el: el,
      map: attrs,
      model: this.model
    });
  };

  // # Props
  //
  // Listen for changes to attributes and update the element's properties
  // accordingly.

  var Props = Quilt.Props = Attrs.extend({accessor: 'prop'});

  patches.props = function(el, props) {
    return new Props({
      el: el,
      map: props,
      model: this.model
    });
  };

  // # Css
  //
  // Listen for changes to attributes and update the element's style
  // accordingly.

  var Css = Quilt.Css = Attrs.extend({accessor: 'css'});

  patches.css = function(el, css) {
    return new Css({
      el: el,
      map: css,
      model: this.model
    });
  };

})();
