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
      var i, el, selector, elements, attr, view, data;
      var attrs = Kinetic.attrs;

      // Destroy old views.
      while (view = this.views.pop()) {
        view.destroy();
      }

      // Render the template if it exists.
      this.$el.html(this.template ? this.template() : '');

      // Create the selector if it hasn't been created already.
      if (!Kinetic.selector) {
        selector = [];
        for (attr in attrs) selector.push('[data-' + dash(attr) + ']');
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

    destroy: function() {
      _.invoke(this.views, 'destroy');
      if (this.model) this.model.off(null, null, this);
      if (this.collection) this.collection.off(null, null, this);
    }

  });

  var Content = View.extend({

    // Render initial content and re-render on changes to the model.
    initialize: function() {
      _.defaults(this.options, {noScript: true});
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

    template: function() {
      var layout = this.options.layout;
      var templates = Kinetic.templates;
      var template = templates[this.options.name];
      var data = {
        view: this,
        model: this.model,
        collection: this.collection
      };

      // If no layout is specified, just render the template.
      if (!layout) return template(data);

      // Set hooks for the layout to render the template.
      data.data = data;
      data.template = template;
      return templates[layout](data);
    }

  });

  Kinetic.attrs = {

    ref: function(el, options) {
      this['$' + options] = $(el);
    },

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

  // Replace upper-case characters with a dash and their lower case version.
  var dash = function(s) {
    return s.replace(/[A-Z]/g, function(c){ return '-' + c.toLowerCase(); });
  };

}).call(this, _, jQuery, Backbone);
