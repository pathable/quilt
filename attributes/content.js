(function(Kinetic) {

  // Detect script tags in an html string.
  var rscript  = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;

  // Track model attributes and update content on change.
  var Content = Kinetic.View.extend({

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

      // If $.truncate is available, use it to truncate the value.
      if ($.truncate && this.options.truncate) {
        value = $.truncate(value, this.options.truncate);
      }

      // Strip script tags if appropriate.
      if (this.options.noScript) value = (value + '').replace(rscript, '');

      this.$el[this.options.accessor](value);
      return this;
    }

  });

  _.each(['html', 'text'], function(accessor) {

    Kinetic.attributes[accessor] = function(el, options) {

      // If `options` is a string, assume it's an attribute.
      if (_.isString(options)) options = {attr: options};

      return new Content(_.extend(options, {
        el: el,
        model: this.model,
        accessor: accessor
      }));
    };

  });

})(Kinetic);
