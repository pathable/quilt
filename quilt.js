(function() {

  // Global object reference.
  var root = this;

  // Global export.
  var Quilt = root.Quilt = {};

  // Current library version.
  Quilt.VERSION = '0.0.1';

  // Find dashes in attribute names.
  var undasher = /-([a-z]|[0-9])/ig;

  // Camel case data attributes.
  var camel = function(match, letter) {
    return (letter + '').toUpperCase();
  };

  // # Quilt.attributes
  //
  // Attribute handlers should be specified in camel case.  The arguments to
  // each handler will be a DOM element and the value of the data attribute.
  // The handler will be called with the parent view as context.
  //
  //     Quilt.attributes.exampleAttr = function(element, options) {
  //       // Called for elements with a "data-example-attr" attribute.
  //     };
  //
  Quilt.attributes = {};

  // # Quilt.View
  // Provide a structure for declaring functionality through data attributes.
  var View = Quilt.View = Backbone.View.extend({

    constructor: function(options) {
      this.views = [];
      if (options && options.template) this.template = options.template;
      Backbone.View.apply(this, arguments);
    },

    // After executing the template function, search the view for relevant
    // attributes, match them with handlers and execute them.  If a handler
    // returns a view, store it for clean up.
    render: function() {
      var elements, el, view, name, attrs, attr;

      // Dispose of old views.
      while (view = this.views.pop()) if (view.dispose) view.dispose();

      // Render the template if it exists.
      if (this.template) {
        this.$el.html(this.template({
          view: this,
          model: this.model,
          collection: this.collection
        }));
      }

      elements = this.$('*').get();

      // Execute the handler for each element/attr pair.
      while (el = elements.pop()) {

        attrs = el.attributes;
        for (var i = 0; i < attrs.length; i++) {

          // Bail unless we have a data attribute.
          if ((name = attrs[i].name).indexOf('data-') !== 0) continue;

          // Camel case and strip "data-".
          name = name.replace(/^data-/, '').replace(undasher, camel);

          // Bail on non-quilt attributes.
          if (!(attr = Quilt.attributes[name])) continue;

          // Execute the handler.
          view = attr.call(this, el, $(el).data(name));

          // Render the view if appropriate.
          if (view instanceof View) this.views.push(view.render());
        }
      }

      return this;
    },

    // Dispose of child views.
    dispose: function() {
      Backbone.View.prototype.dispose.apply(this, arguments);
      _.invoke(this.views, 'dispose');
      return this;
    }

  });

})();
