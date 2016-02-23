

var app = app || {};

app.DateView = Backbone.View.extend({

  'el': $('#header-date'),

  'events': {
    'keydown .date-input': 'escape'
  },

  'initialize': function() {
    this.date = this.model.get('date');
  },

  'render': function() {
    this.$el.val(this.date);
    return this;
  },

  'getDateObj': function() {
    var dateObj = this.model.createDateObject();
    return dateObj;
  },

  'empty': function() {
    this.$el.empty().off();
    this.stopListening();
    return this;
  },

  'escape': function(e) {
    if (e.which === ESC_KEY) {
      this.$el.find('.date-input').blur();
    }
  }

});