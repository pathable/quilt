(function() {

  // Global object reference.
  var root = this;

  // Global export.
  var Quilt = root.Quilt = {};

  // Current library version.
  Quilt.VERSION = '0.0.1';

  // Replace upper case characters for data attributes.
  var dasher = /([A-Z])/g;

  // # Quilt.View
  // Provide a structure for declaring functionality through data attributes.
  var View = Quilt.View = Backbone.View.extend({

    constructor: function() {
      this.views = [];
      Backbone.View.apply(this, arguments);
    },

    // After executing the template function, search the view for relevant
    // attributes, match them with handlers and execute them.  If a handler
    // returns a view, store it for clean up.
    render: function() {
      var el, view;

      // Destroy old views.
      while (view = this.views.pop()) if (view.destroy) view.destroy();

      // Render the template if it exists.
      if (this.template) {
        this.$el.html(this.template({
          view: this,
          model: this.model,
          collection: this.collection
        }));
      }

      // Create the selector if it hasn't been created already.
      if (!Quilt.selector) {
        Quilt.selector = _.map(_.keys(Quilt.attributes), function(attr) {
          return '[data-' + attr.replace(dasher, '-$1').toLowerCase() + ']';
        }).join(',');
      }

      // Find all elements with appropriate attributes.
      var elements = this.$(Quilt.selector).get();

      // Execute the handler for each element/attr pair.
      while (el = elements.pop()) {

        // Retrieve all data attributes.
        var data = $(el).data();

        for (var attr in data) {
          // Bail for non-quilt attributes.
          if (!Quilt.attributes[attr]) continue;

          // Execute the handler.
          view = Quilt.attributes[attr].call(this, el, data[attr]);

          // Render the view if appropriate.
          if (view instanceof View) this.views.push(view.render());
        }
      }

      return this;
    },

    // Destroy child views and ensure that references to this view are
    // eliminated to prevent memory leaks.
    destroy: function() {

      // Remove DOM listeners.
      this.undelegateEvents();

      // Destroy child views.
      _.invoke(this.views, 'destroy');

      // Clean up event handlers.
      if (this.model) this.model.off(null, null, this);
      if (this.collection) this.collection.off(null, null, this);

      return this;
    }

  });


  // Attribute handlers should be specified in camel case.  The arguments to
  // each handler will be a DOM element and the value of the data attribute.
  // The handler will be called with the parent view as context.
  //
  //    Quilt.attributes.exampleAttr = function(element, options) {
  //      // Called for elements with a "data-example-attr" attribute.
  //    };
  //
  Quilt.attributes = {};

})();
