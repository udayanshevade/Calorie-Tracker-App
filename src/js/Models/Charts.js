

var app = app || {};

/*
 * Model for handling charts logic
 */
app.Charts = Backbone.Model.extend({

  // default attributes
  'defaults': {
    'visible': false,
    'period': 'weekly'
  },

  // open display
  'open': function() {
    this.set({
      'visible': true
    });
  }

});

app.charts = new app.Charts();