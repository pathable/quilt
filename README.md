# Kinetic

Kinetic is a foundation for declarative behavior in Backbone views through data
attributes.  By declaring behavior in discrete pieces based solely on the
current model and/or collection, components can be tested in isolation and
composed into larger behaviors.

# Attributes

Kinetic attributes are declared by augmenting `Kinetic.attributes` like the
following:

```javascript
Kinetic.attributes.myAttr = function(el, options) {
  // Your code here.
};
```

This function takes an element and an options object as arguments and is called
with the parent view as context (this).  If a view is returned, it will be tracked
by the parent view and cleaned up when destroyed.

In the following example, `el` will be a paragraph element and `options` will
be `{foo: true}`.  Note that camel cased attributes on `Kinetic.attributes` are
converted to their dashed counterpart in html (and vice versa).  Also, options
are parsed as json using `jQuery.fn.data`.

```html
<p data-my-attr='{"foo": true}'></p>
```

# Example - Name

The following example will display the `"name"` attribute of the current model
and update on `"change"`.

```javascript
var Name = Kinetic.View.extend({

  initialize: function() {
    this.model.on('change', this.render, this);
  },

  render: function() {
    this.$el.html(this.model.get('name'));
    return this;
  }

});

Kinetic.attributes.name = function(el, options) {
  return new Name({el: el, model: this.model});
};
```

# Conventions

## destroy

*view.destroy()*

Kinetic views are assumed to have a `destroy` method that cleans up any
handlers or other references that might cause memory leaks.  `destroy` is
called automatically for child views.

## template

*view.template(data)*

If a views should render a template, it is assumed to have a `template` method
that takes a `data` argument with the data to be rendered.  By default, `data`
includes the `model`, `collection`, and `view`.

# Utility

## resolve

*view.resolve(path)*

Traverse a view-relative or absolute (relative to the global object) path and
return the final value.

```javascript
var view = new Kinetic.View();
view.model = new Backbone.Model();
view.model.foo = {};
view.resolve('@model.foo') === view.model.foo; // true
```
