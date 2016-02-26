

var app = app || {};

/*
 * Persisting date model
 */
app.Date = Backbone.Model.extend({

  // default attributes for any new date object
  'defaults': {
    'foods': null
  },

  // local-storage for persistence
  // store under 'dates-backbone'
  'localStorage': new Backbone.LocalStorage('dates-backbone'),

  // method for creating a temporary date object for manipulation
  'createDateObject': function() {
    var date = new Date(this.get('date'));
    return date;
  },

  // update the date model's calories
  'updateCalories': function() {
    this.save({
      'calories': app.calorieCount.get('calories')
    });
  },

  // update the added food items for the date
  'updateFoods': function() {
    this.save({
      'foods': app.foods
    });
  }



});