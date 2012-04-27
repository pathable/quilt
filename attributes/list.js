(function($, Kinetic) {

  var List = Kinetic.List = Kinetic.View.extend({

    initialize: function() {
      List.__super__.initialize.apply(this, arguments);
      this._views = {};
      this.childEl = this.$el.children(':first');
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

    render: function() {
      this.collection.each(this.add, this);
      return this;
    },

    changeId: function(model, id) {
      var view = this._views[model.cid];
      if (id != null && view) this._views[id] = view;
      if (id == null) delete this._views[model.previous('id')];
    },

    add: function(model) {
      if (this.findView(model)) return;

      var view = new Kinetic.Template(_.extend({}, this.options.template, {
        model: model,
        el: this.childEl.clone()
      }));

      // Add the view to various caches.
      this._views[model.cid] = this._views[view.cid] = view;
      if (model.id != null) this._views[model.id] = view;
      var index = this.collection.indexOf(model);
      this.views.splice(index, 0, view);

      view.render();

      // Insert the view into the DOM.
      var prev = this.findView(this.collection.at(index - 1));
      if (prev) prev.$el.after(view.el);
      else this.$el.prepend(view.el);
    },

    remove: function(model) {
      var view = this.findView(model);
      if (!view) return;

      // Remove from the DOM.
      view.$el.remove();
      view.destroy();

      // Clean up.
      delete this._views[model.cid];
      delete this._views[view.cid];
      if (model.id != null) delete this._views[model.id];
      this.views.splice(_.indexOf(this.views, view), 1);
    },

    reset: function() {
      this.collection.each(this.add, this);
      var models = _.pluck(this.views, 'model');
      _.each(_.difference(models, this.collection.models), this.remove, this);
      this.views = this.collection.map(this.findView, this);
      _.each(this.views, function(view) {
        this.$el.append(view.el);
      }, this);
      this.trigger('reset', this);
    }

  });

  Kinetic.attributes.list = function(el, options) {
    options.el = el;
    options.collection = this.resolve(options.collection) || this.collection;
    return new Kinetic.List(options);
  };

})(jQuery, Kinetic);
