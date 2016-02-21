

var app = app || {};

app.FoodResult = Backbone.Model.extend({

  'defaults': {
    'selected': false,
    'item_amount': 1
  },

  'toggleSelected': function() {
    this.set({
      'selected': !this.get('selected')
    });
  }


});