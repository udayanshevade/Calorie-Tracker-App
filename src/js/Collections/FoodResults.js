

var app = app || {};

/*
 * Food results collection
 */
app.FoodResults = Backbone.Collection.extend({

  // uses model food result
  'model': app.FoodResult,

});

app.foodResults = new app.FoodResults();