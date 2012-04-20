(function(_, $, Backbone) {

  var root = this;
  var Kinetic = root.Kinetic = {};

  // Template hash.
  Kinetic.templates = {};

  // Detect script tags in an html string.
  var rscript  = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;

  var View = Kinetic.View = Backbone.View.extend({

    constructor: function() {
      this.views = [];
      View.__super__.constructor.apply(this, arguments);
    },

    render: function() {
      var i, el, selector, elements, attr, view, options;
      var attrs = Kinetic.attrs;

      // Destroy old views.
      while (view = this.views.pop()) {
        view.destroy();
      }

      // Execute the template.
      this.$el.html(this.template());

      // Create the selector if it hasn't been created already.
      if (!Kinetic.selector) {
        selector = [];
        for (attr in attrs) {
          selector.push('[data-' + attr + ']');
        }
        Kinetic.selector = selector.join(',');
      }

      // Find all elements with appropriate attributes.
      elements = this.$(Kinetic.selector);

      // Create a view for each element.
      for (attr in attrs) {
        elements = elements.filter('[data-' + attr + ']');
        for (i = 0; i < elements.length; i++) {
          el = elements[i];
          options = $(el).data(attr);
          this.views.push(attrs[attr].call(this, el, options));
        }
        elements = elements.end();
      }

      return this;
    },

    template: function() {
      return '';
    },

    destroy: function() {
      this.remove();
      _.invoke(this.views, 'destroy');
      if (this.model) this.model.off(null, null, this);
      if (this.collection) this.collection.off(null, null, this);
    }

  });

  var Content = View.extend({

    // Render initial content and re-render on changes to the model.
    initialize: function() {
      _.defaults(this.options, {noScript: true});
      this.render();
      this.model.on('change', this.change, this);
    },

    change: function() {
      if (!this.model.hasChanged(this.options.attr)) return;
      this.render();
    },

    render: function() {
      var value = this.model.get(this.options.attr);
      if (this.options.noScript) value = (value + '').replace(rscript, '');
      this.$el[this.options.accessor](value);
      return this;
    }

  });

  var Template = Kinetic.View.extend({

    initialize: function() {
      this.render();
    },

    template: function() {
      return Kinetic.templates[this.options.name]({
        view: this,
        model: this.model,
        collection: this.collection
      });
    }

  });

  Kinetic.attrs = {

    template: function(el, options) {

      // If `options` is a string, assume it's the template name.
      if (_.isString(options)) options = {name: options};

      // Set model/collection from provided properties.
      if (options.model) {
        options.model = this.model[options.model];
      }
      if (options.collection) {
        options.collection = this.model[options.collection];
      }

      _.defaults(options, {
        model: this.model,
        collection: this.collection
      });

      options.el = el;
      return new Template(options);
    }

  };

  // Html and text content views.
  _.each(['html', 'text'], function(accessor) {

    Kinetic.attrs[accessor] = function(el, options) {

      // If `options` is a string, assume it's an attribute.
      if (_.isString(options)) options = {attr: options};

      return new Content(_.extend(options, {
        el: el,
        model: this.model,
        accessor: accessor
      }));
    };

  });

}).call(this, _, jQuery, Backbone);
