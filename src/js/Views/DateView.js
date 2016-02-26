

var app = app || {};

/*
 * Date Section View
 */
app.DateView = Backbone.View.extend({

  // binds DOM date container
  'el': $('#header-date'),

  // DOM events for the date input
  'events': {
    'keydown .date-input': 'escape'
  },

  // cache current date
  'initialize': function() {
    this.date = this.model.get('date');
  },

  // render the selected/current value
  'render': function() {
    this.$el.val(this.date);
    return this;
  },

  // get an associated date object for manipulation
  'getDateObj': function() {
    var dateObj = this.model.createDateObject();
    return dateObj;
  },

  // empty the date element, unbind events
  'empty': function() {
    this.$el.empty().off();
    this.stopListening();
    // for chaining
    return this;
  },

  // escape shortcut
  'escape': function(e) {
    if (e.which === ESC_KEY) {
      this.$el.find('.date-input').blur();
    }
  }

});