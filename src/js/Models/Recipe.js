
var app = app || {};

/*
 * Model for recipe details logic
 */
app.Recipe = Backbone.Model.extend({

  // default attributes
  'defaults': {
    'visible': false,
  },

  // open recipe details
  'recipeOpen': function() {
    this.set({
      'visible': true
    });
  }

});

app.recipe = new app.Recipe();