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
      this.views = [];
      if (options && options.template) this.template = options.template;
      Backbone.View.apply(this, arguments);
    },

    // After executing the template function, search the view for relevant
    // patches, match them with handlers and execute them.  If a handler
    // returns a view, store it for clean up.
    render: function() {

      // Dispose of old views.
      _.invoke(this.views, 'dispose');

      // Render the template if it exists.
      if (this.template) {
        this.$el.html(this.template({
          view: this,
          model: this.model,
          collection: this.collection
        }));
      }

      var elements = this.$('*').get();

      // Execute the handler for each element/attr pair.
      for (var i = 0; i < elements.length; i++) {
        var el = elements[i];
        var attrs = el.attributes;

        for (var j = 0; j < attrs.length; j++) {

          // Bail unless we have a data attribute.
          var name = attrs[j].name;
          if (!dataAttr.test(name)) continue;

          // Camel case and strip "data-".
          name = name.replace(dataAttr, '').replace(undasher, camel);

          // Bail on attributes with no corresponding patch.
          var attr = Quilt.patches[name];
          if (!attr) continue;

          // Execute the handler.
          var view = attr.call(this, el, $(el).data(name));

          // Render the view if appropriate.
          if (view instanceof View) this.views.push(view.render());
        }
      }

      return this;
    },

    // Dispose of child views.
    dispose: function() {
      this.stopListening();
      this.undelegateEvents();
      _.invoke(this.views, 'dispose');
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
  Quilt.patches = {

    ref: function(el, name) {
      this['$' + name] = $(el);
    },

    show: function(el, attr) {
      return new Show({
        el: el,
        attr: attr,
        model: this.model
      });
    },

    hide: function(el, attr) {
      return new Hide({
        el: el,
        attr: attr,
        model: this.model
      });
    },

    html: function(el, attr) {
      return new Html({
        el: el,
        attr: attr,
        model: this.model
      });
    },

    escape: function(el, attr) {
      return new Escape({
        el: el,
        attr: attr,
        model: this.model
      });
    }

  };

  // # Show
  //
  // Listen for changes to an attribute and show the element if the value is
  // truthy, hiding it otherwise.

  var Show = Quilt.View.extend({

    initialize: function(options) {
      this.attr = options.attr;
      this.listenTo(this.model, 'change:' + this.attr, this.render);
    },

    render: function() {
      var value = this.model.get(this.attr);
      this.$el.toggleClass('hide', this.invert ? !!value : !value);
      return this;
    }

  });

  // # Hide
  //
  // Listen for changes to an attribute and hide the element if the value is
  // truthy, showing it otherwise.

  var Hide = Show.extend({invert: true});

  // # Html
  //
  // Listen for changes to an attribute, updating the element's content with
  // it's value.

  var Html = Quilt.View.extend({

    initialize: function(options) {
      this.attr = options.attr;
      this.listenTo(this.model, 'change:' + this.attr, this.render);
    },

    render: function() {
      var value = this.model[this.escape ? 'escape' : 'get'](this.attr);
      this.$el.html(this.model.get(this.attr));
      return this;
    }

  });

  // # Escape
  //
  // Listen for changes to an attribute, updating the element's content with
  // it's escaped value.

  var Escape = Html.extend({escape: true});

})();
