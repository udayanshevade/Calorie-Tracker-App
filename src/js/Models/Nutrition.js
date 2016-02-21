
var app = app || {};

app.Nutrition = Backbone.Model.extend({

  'defaults': {
    'nutrition_visible': false,
    'DV_total_fat': 65,
    'DV_saturated_fat': 20,
    'DV_cholesterol': 300,
    'DV_sodium': 2400,
    'DV_total_carbohydrate': 300,
    'DV_fiber': 25,
    'DV_protein': 50,
    'item_amount': 1
  },

  'nutritionExpand': function() {
    this.set({
      'nutrition_visible': true
    });
  }

});

app.nutrition = new app.Nutrition();