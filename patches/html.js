define(function() {

  // Render the value of an attribute inside `el`, using the specified model
  // and updating the value on change.
  Quilt.attributes.html = function(el, options) {
    if (!options) options = {};

    // If `options` is a string, assume it's an attribute name.
    if (_.isString(options)) options = {attr: options};

    options.model = this.model;
    options.el = el;
    return new Html(options);
  };

  // Render the escaped value of an attribute inside `el`, using the
  // specified model and updating the value on change.
  Quilt.attributes.text = function(el, options) {
    if (!options) options = {};

    // If `options` is a string, assume it's an attribute name.
    if (_.isString(options)) options = {attr: options};

    options.model = this.model;
    options.el = el;
    options.escape = true;
    return new Html(options);
  };

  // # Html
  // Render an attribute value as html, updating on change.
  var Html = Quilt.Html = Quilt.View.extend({

    initialize: function(options) {
      this.attr = options.attr;
      this.escape = options.escape;
      this.truncate = options.truncate;
      if (this.model) this.model.on('change:' + this.attr, this.render, this);
    },

    render: function() {
      if (!this.model) return this;
      var value = this.model.get(this.attr);
      value = (value == null ? '' : value).toString();

      // Escape the value if appropriate.
      if (this.escape) value = _.escape(value);

      // Truncate if specified and available.
      if (this.truncate && P && P.truncate) {
        value = P.truncate(value, this.truncate);
      }

      // Hide when empty.
      this.$el.html(value).toggleClass('hide', !value);

      return this;
    }

  });

  return Html;

});
