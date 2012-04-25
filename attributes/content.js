(function(Kinetic) {

  // Detect script tags in an html string.
  var rscript  = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;

  // Track model attributes and update on change.
  var Content = Kinetic.View.extend({

    // Render initial content and re-render on changes to the model.
    initialize: function() {
      _.defaults(this.options, {noScript: true});
      this.model.on('change', this.change, this);
    },

    change: function() {
      if (!this.model.hasChanged(this.options.attr)) return;
      this.render();
    }

  });

  var Html = Content.extend({

    render: function() {
      var value = this.model.get(this.options.attr);

      // Strip script tags if appropriate.
      if (this.options.noScript) value = (value + '').replace(rscript, '');

      // Truncate if appropriate.
      if ($.truncate && this.options.truncate) {
        value = $.truncate(value, this.options.truncate);
      }

      this.$el.html(value);
      return this;
    }

  });

  var Text = Content.extend({

    render: function() {
      var value = this.model.get(this.options.attr);

      // Truncate if appropriate.
      if ($.truncate && this.options.truncate) {
        value = $.truncate(value, this.options.truncate);
      }

      this.$el.text(value);
      return this;
    }

  });

  _.each({html: Html, text: Text}, function(View, attr) {

    Kinetic.attributes[attr] = function(el, options) {
      // If `options` is a string, assume it's an attribute.
      if (_.isString(options)) options = {attr: options};
      options.el = el;
      options.model = this.model;
      return new View(options);
    };

  });

})(Kinetic);
