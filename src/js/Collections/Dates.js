

var app = app || {};

/*
 * Persisted collection of dates
 */
app.Dates = Backbone.Collection.extend({

  // uses the date model
  'model': app.Date,

  // stores under 'dates-backbone' locally
  'localStorage': new Backbone.LocalStorage('dates-backbone'),

  // orders the dates
  'comparator': function(model) {
    var date = new Date(model.get('date'));
    return -date.getTime();
  }

});

app.dates = new app.Dates();