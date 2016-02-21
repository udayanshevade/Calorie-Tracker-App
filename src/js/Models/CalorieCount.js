
var app = app || {};

app.CalorieCount = Backbone.Model.extend({

  'defaults': {
    'quota': 2000,
    'calories': 0,
    'countUp': false
  },

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

  'toggleMode': function() {
    this.set({
      'countUp': !this.get('countUp')
    });
  }

});