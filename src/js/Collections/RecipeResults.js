
var app = app || {};

/*
 * Recipe result view
 */
app.RecipeResults = Backbone.Collection.extend({

  // uses model recipe
  'model': app.RecipeResult,

});

app.recipeResults = new app.RecipeResults()