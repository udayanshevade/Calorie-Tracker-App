

var app = app || {};

app.FoodResults = Backbone.Collection.extend({

  'model': app.FoodResult,

});

app.foodResults = new app.FoodResults();