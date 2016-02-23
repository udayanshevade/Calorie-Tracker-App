
var app = app || {};

app.RecipeInput = Backbone.Model.extend({

  'defaults': {
    'visible': false
  },

  'openRecipesMode': function() {
    this.set({
      'visible': true
    });
  },

  'closeRecipesMode': function() {
    this.set({
      'visible': false
    })
  }

});

app.recipeInput = new app.RecipeInput();