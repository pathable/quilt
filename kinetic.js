(function() {

  var root = this;
  var Kinetic = root.Kinetic = {};

  Kinetic.VERSION = '0.0.1';

  // Replace upper case characters for data attributes.
  var dasher = /([A-Z])/g;

  // # Kinetic.View
  //
  // Provide a structure for declaring functionality through data attributes.
  var View = Kinetic.View = Backbone.View.extend({

    constructor: function() {
      this.views = [];
      Backbone.View.apply(this, arguments);
    },

    // After executing the template function, search the view for relevant
    // attributes, match them with handlers and execute them.  If a handler
    // returns a view, store it for clean up.
    render: function() {
      var i, el, selector, elements, attr, view, data;
      var attrs = Kinetic.attributes;

      // Destroy old views.
      while (view = this.views.pop()) {
        if (view.destroy) view.destroy();
      }

      // Render the template if it exists.
      if (this.template) {
        this.$el.html(this.template({
          view: this,
          model: this.model,
          collection: this.collection
        }));
      }

      // Create the selector if it hasn't been created already.
      if (!Kinetic.selector) {
        selector = [];
        for (attr in attrs) {
          attr = attr.replace(dasher, '-$1').toLowerCase();
          selector.push('[data-' + attr + ']');
        }
        Kinetic.selector = selector.join(',');
      }

      // Find all elements with appropriate attributes.
      elements = this.$(Kinetic.selector).get();

      // Execute the handler for each element/attr pair.
      while (el = elements.pop()) {
        data = Backbone.$(el).data();
        for (attr in data) {
          if (!attrs[attr]) continue;
          view = attrs[attr].call(this, el, data[attr]);
          if (view instanceof View) this.views.push(view.render());
        }
      }

      return this;
    },

    // Destroy child views and ensure that references to this view are
    // eliminated to prevent memory leaks.
    destroy: function() {
      var view;

      // Destroy child views.
      while (view = this.views.pop()) if (view.destroy) view.destroy();

      // Clean up event handlers.
      if (this.model) this.model.off(null, null, this);
      if (this.collection) this.collection.off(null, null, this);
    },

    // Look up a property.  A leading @ indicates that the property is relative
    // to the view.  Otherwise it's relative to the root (window).
    resolve: function(path) {
      if (path == null) return null;

      // Use the view when there is a leading @.
      var o = /^@/.test(path) ? this : root;

      // Split the rest of the string and walk the property path.
      path = path.replace(/^@/, '').split('.');
      while (path.length) o = _.result(o, path.shift());
      return o;
    }

  });

  // # Template
  //
  // Render a template by name, with optional layout.
  var Template = Kinetic.Template = View.extend({

    initialize: function(options) {
      this.name = options.name;
      this.layout = options.layout;
    },

    // Render the template by name.
    template: function(data) {
      var html = Kinetic.templates[this.name](data);

      // Use layout if appropriate.
      if (this.layout) {
        data.content = html;
        html = Kinetic.templates[this.layout](data);
      }

      return html;
    }

  });

  // Attribute handlers should be specified in camel case.  The arguments to
  // each handler will be a DOM element and the value of the data attribute.
  // The handler will be called with the parent view as context.
  //
  //    Kinetic.attributes.exampleAttr = function(element, options) {
  //      // Called for elements with a "data-example-attr" attribute.
  //    };
  //
  Kinetic.attributes = {

    // Render a template inside `el`, using the specified model, collection,
    // and layout.
    template: function(el, options) {

      // If `options` is a string, assume it's a template name.
      if (_.isString(options)) options = {name: options};

      // Resolve collection and model references.
      options.model = this.resolve(options.model) || this.model;
      options.collection = this.resolve(options.collection) || this.collection;

      options.el = el;
      return new Template(options);
    }

  };

})();
