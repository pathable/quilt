(function(_, $, Backbone) {

  var root = this;
  var Kinetic = root.Kinetic = {};

  // Attribute handlers should be specified in camel case.  The arguments to
  // each handler will be a DOM element and the value of the data attribute.
  // The handler will be called with the parent view as context.
  //
  //    Kinetic.attributes.fooBar = function(element, options) {
  //      // Called for elements with a data-foo-bar attribute.
  //    };
  //
  Kinetic.attributes = {};

  // Replace upper case characters for data attributes.
  var dasher = /([A-Z])/g;

  var View = Kinetic.View = Backbone.View.extend({

    constructor: function() {
      this.views = [];
      View.__super__.constructor.apply(this, arguments);
    },

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

      // Create a view for each element/attr pair.
      while (el = elements.pop()) {
        data = $(el).data();
        for (attr in data) {
          if (!attrs[attr]) continue;
          view = attrs[attr].call(this, el, data[attr]);
          if (view) this.views.push(view.render());
        }
      }

      return this;
    },

    // Destroy child views and ensure that references to this view are
    // eliminated to prevent memory leaks.
    destroy: function() {
      var view;

      // Destroy child views.
      while (view = this.views.pop()) {
        if (view.destroy) view.destroy();
      }

      // Clean up event handlers.
      if (this.model) this.model.off(null, null, this);
      if (this.collection) this.collection.off(null, null, this);
    },

    // Look up a property.  A leading @ means the property is relative to the
    // view.  Otherwise it's relative to the root (window).
    resolve: function(path) {
      if (path == null) return null;

      // Use the view when there is a leading @.
      var o = /^@/.test(path) ? this : root;

      // Split the rest of the string and walk the property path.
      path = path.replace(/^@/, '').split('.');
      while (path.length) o = o[path.shift()];
      return o;
    }

  });

}).call(this, _, jQuery, Backbone);
