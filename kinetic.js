(function() {

  var root = this;
  var Kinetic = root.Kinetic = {};

  Kinetic.VERSION = '0.0.1';

  // Replace upper case characters for data attributes.
  var dasher = /([A-Z])/g;

  // # Kinetic.View
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

  // # Html
  // Render an attribute value as html, updating on change.
  var Html = Kinetic.Html = View.extend({

    initialize: function(options) {
      this.attr = options.attr;
      this.escape = options.escape;
      this.truncate = options.truncate;
      if (this.model) this.model.on('change:' + this.attr, this.render, this);
    },

    render: function() {
      if (!this.model) return this;
      var value = (this.model.get(this.attr) || '').toString();

      // Escape the value if appropriate.
      if (this.escape) value = _.escape(value);

      // Truncate if specified and available.
      if (this.truncate && Backbone.$.truncate) {
        value = Backbone.$.truncate(value, this.truncate);
      }

      // Hide when empty.
      this.$el.html(value).toggleClass('hide', !value);
      return this;
    }

  });

  // # Template
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

  // # List
  // Render a list of models with the specified template.
  var List = Kinetic.List = View.extend({

    initialize: function(options) {
      this._views = {};

      // Save a reference to the list item.
      this.item = this.$el.children().first();
      this.$el.empty();

      this.collection
        .on('add', this.add, this)
        .on('remove', this.remove, this)
        .on('reset', this.reset, this)
        .on('change:id', this.changeId, this);
    },

    // Find a view by (c)id.
    findView: function(id) {
      return this._views && this._views[id && id.cid || id];
    },

    // Add models, rendering a list item for each.
    render: function() {
      this.collection.each(this.add, this);
      return this;
    },

    // Update the cache when a model's id changes.
    changeId: function(model, id) {
      var view = this._views[model.cid];
      if (view && id != null) this._views[id] = view;
      var previous = model.previous('id');
      if (previous != null) delete this._views[previous];
    },

    // Render a list item for the added model, updating the cache and inserting
    // the item in the DOM in order.
    add: function(model) {
      if (this.findView(model)) return;

      var options = this.item.data('item');
      if (_.isString(options)) options = {name: options};
      options.el = this.item.clone();
      options.model = model;
      var view = new Template(options);

      // Add the view to the cache.
      this._views[model.cid] = this._views[view.cid] = view;
      if (model.id != null) this._views[model.id] = view;

      var index = this.collection.indexOf(model);
      this.views.splice(index, 0, view);

      view.render();

      // Insert the view into the DOM.
      var previous = this.findView(this.collection.at(index - 1));
      if (previous) previous.$el.after(view.el);
      else this.$el.prepend(view.el);
    },

    // Destory the removed model's view and remove it from the DOM.
    remove: function(model) {
      var view = this.findView(model);
      if (!view) return;

      // Remove from the DOM and destroy.
      view.$el.remove();
      view.destroy();

      // Clean up.
      delete this._views[model.cid];
      delete this._views[view.cid];
      if (model.id != null) delete this._views[model.id];
      this.views.splice(_.indexOf(this.views, view), 1);
    },

    // Soft reset the list to avoid re-rendering models that haven't changed.
    reset: function() {
      this.collection.each(this.add, this);
      var models = _.pluck(this.views, 'model');
      _.each(_.difference(models, this.collection.models), this.remove, this);
      this.views = this.collection.map(this.findView, this);
      this.$el.append(_.pluck(this.views, 'el'));
    }

  });

  // # Toggle
  // Toggle content based on the value of a specific attribute.
  var Toggle = Kinetic.Toggle = View.extend({

    initialize: function(options) {
      this.attr = options.attr;
      this.invert = options.invert;
      if (this.model) this.model.on('change:' + this.attr, this.render, this);
    },

    render: function() {
      if (!this.model) return;
      var value = this.model.get(this.attr);
      this.$el.toggleClass('hide', this.invert ? value : !value);
      return this;
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

    // Render the value of an attribute inside `el`, using the specified model
    // and updating the value on change.
    html: function(el, options) {
      if (!options) options = {};

      // If `options` is a string, assume it's an attribute name.
      if (_.isString(options)) options = {attr: options};

      // Resolve model reference.
      options.model = this.resolve(options.model) || this.model;

      options.el = el;
      return new Html(options);
    },

    // Render the escaped value of an attribute inside `el`, using the
    // specified model and updating the value on change.
    text: function(el, options) {
      if (!options) options = {};

      // If `options` is a string, assume it's an attribute name.
      if (_.isString(options)) options = {attr: options};

      // Resolve model reference.
      options.model = this.resolve(options.model) || this.model;

      options.el = el;
      options.escape = true;
      return new Html(options);
    },

    // Render a template inside `el`, using the specified model, collection,
    // and layout.
    template: function(el, options) {
      if (!options) options = {};

      // If `options` is a string, assume it's a template name.
      if (_.isString(options)) options = {name: options};

      // Resolve collection and model references.
      options.model = this.resolve(options.model) || this.model;
      options.collection = this.resolve(options.collection) || this.collection;

      options.el = el;
      return new Template(options);
    },

    // Render a list of items according to a collection path and a template,
    // specified by data-item on the child element.
    //
    //    <ul data-list='@collection'>
    //      <li data-item='template-name'></li>
    //    </ul>
    list: function(el, options) {
      if (!options) options = {};

      // If `options` is a string, assume it to be a collection path.
      if (_.isString(options)) options = {collection: options};

      // Resolve collection and model references.
      options.model = this.resolve(options.model) || this.model;
      options.collection = this.resolve(options.collection) || this.collection;

      options.el = el;
      return new List(options);
    },

    // Show content if `attr` is true, hide it otherwise.
    show: function(el, options) {
      if (!options) options = {};

      // If `options` is a string assume it to be an attribute.
      if (_.isString(options)) options = {attr: options};

      // Resolve model references.
      options.model = this.resolve(options.model) || this.model;

      options.el = el;
      return new Toggle(options);
    },

    // Hide content if `attr` is true, show it otherwise.
    hide: function(el, options) {
      if (!options) options = {};

      // If `options` is a string assume it to be an attribute.
      if (_.isString(options)) options = {attr: options};

      // Resolve model references.
      options.model = this.resolve(options.model) || this.model;

      options.el = el;
      options.invert = true;
      return new Toggle(options);
    }

  };

})();
