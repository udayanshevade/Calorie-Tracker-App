
var app = app || {};

/*
 * Model for each recipe result logic
 */
app.RecipeResult = Backbone.Model.extend({

  // default attributes for each recipe result
  'defaults': {
    'selected': false,
    'title': '',
    'time': 0,
    'img': '',
    'source': '',
    'ingredients': [],
    'id': '',
    'flavors': null
  },

  // highlight selected recipe
  'toggleSelected': function() {
    this.set({
      'selected': !this.get('selected')
    });
  }


});