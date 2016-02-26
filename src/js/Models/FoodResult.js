

var app = app || {};

/*
 * Model for searched food result logic
 */
app.FoodResult = Backbone.Model.extend({

  // default attributes
  'defaults': {
    'selected': false,
    'item_amount': 1
  },

  // select/deselect list element
  'toggleSelected': function() {
    this.set({
      'selected': !this.get('selected')
    });
  }


});