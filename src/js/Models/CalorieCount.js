
var app = app || {};

/*
 * Model for handling calorie count data
 */
app.CalorieCount = Backbone.Model.extend({

  // default attributes
  // TODO: allow user to customize calorie limit
  'defaults': {
    'quota': 2000,
    'calories': 0,
    'countUp': false
  },

  // update calories whenever the added foods change
  'updateCalories': function() {
    var that = this;

    var cals = 0;

    app.foods.each(function(item) {
      var food = item.attributes;
      cals += (food.nf_calories * food.item_amount);
    });

    this.set({
      'calories': cals
    });

  },

  // set the mode for counting up or down
  'toggleMode': function() {
    this.set({
      'countUp': !this.get('countUp')
    });
  }

});