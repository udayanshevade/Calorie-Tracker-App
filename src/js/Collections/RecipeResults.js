
var app = app || {};

app.RecipeResults = Backbone.Collection.extend({

  'model': app.Recipe,

});

app.recipeResults = new app.RecipeResults()