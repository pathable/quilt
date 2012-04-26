(function($, Kinetic) {

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

  Kinetic.Html = Content.extend({

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

  Kinetic.Text = Content.extend({

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

  Kinetic.Date = Content.extend({

    render: function() {
      var value = this.model.get(this.options.attr);

      if (typeof moment === 'undefined') {
        this.$el.text(value);
        return this;
      }

      if (typeof moment !== 'undefined') {
        value = /^fromnow$/i.test(this.options.format) ?
          moment(value).fromNow() :
          moment(value).format(this.options.format);
      }

      this.$el.text(value);
      return this;
    }

  });

  var attrs = {
    html: Kinetic.Html,
    text: Kinetic.Text,
    date: Kinetic.Date
  };

  _.each(attrs, function(View, attr) {

    Kinetic.attributes[attr] = function(el, options) {
      // If `options` is a string, assume it's an attribute.
      if (_.isString(options)) options = {attr: options};
      options.el = el;
      options.model = this.model;
      return new View(options);
    };

  });

})(jQuery, Kinetic);
