
var app = app || {};

/*
 * Model for manual input mode logic
 */
app.ManualInput = Backbone.Model.extend({

  // default attributes
  'defaults': {
    'visible': false
  },

  // expands manual mode
  'openManualMode': function() {
    this.set({
      'visible': true
    });
  },

  // collapses manual mode
  'closeManualMode': function() {
    this.set({
      'visible': false
    });
  }

});

app.manualInput = new app.ManualInput();