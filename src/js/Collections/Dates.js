

var app = app || {};

app.Dates = Backbone.Collection.extend({

  'model': app.Date,

  'localStorage': new Backbone.LocalStorage('dates-backbone'),

  'comparator': function(model) {
    var date = new Date(model.get('date'));
    return -date.getTime();
  }

});

app.dates = new app.Dates();