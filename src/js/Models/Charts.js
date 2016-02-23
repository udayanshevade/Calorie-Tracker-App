

var app = app || {};

app.Charts = Backbone.Model.extend({

  'defaults': {
    'visible': false,
    'period': 'weekly'
  },

  'open': function() {
    this.set({
      'visible': true
    });
  }

});

app.charts = new app.Charts();