
var app = app || {};

app.Recipe = Backbone.Model.extend({

  'defaults': {
    'visible': false,
  },

  'recipeOpen': function() {
    this.set({
      'visible': true
    });
  }

});

app.recipe = new app.Recipe();