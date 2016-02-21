

var app = app || {};

app.Date = Backbone.Model.extend({

  'defaults': {
    'foods': null
  },

  'localStorage': new Backbone.LocalStorage('dates-backbone'),

  'createDateObject': function() {
    var date = new Date(this.get('date'));
    return date;
  },

  'updateCalories': function() {
    this.save({
      'calories': app.calorieCount.get('calories')
    });
  },

  'updateFoods': function() {
    this.save({
      'foods': app.foods
    });
  }



});