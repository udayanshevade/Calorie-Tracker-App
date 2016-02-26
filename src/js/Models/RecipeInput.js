
var app = app || {};

/*
 * Model for recipe input mode logic
 */
app.RecipeInput = Backbone.Model.extend({

  // default attributes
  'defaults': {
    'visible': false
  },

  // expand recipes mode
  'openRecipesMode': function() {
    this.set({
      'visible': true
    });
  },

  // collapses recipes mode
  'closeRecipesMode': function() {
    this.set({
      'visible': false
    })
  }

});

app.recipeInput = new app.RecipeInput();