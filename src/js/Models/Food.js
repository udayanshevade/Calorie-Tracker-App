
var app = app || {};

/**
 * Define Food Model
 * This will determine the total calorie count
 */
app.Food = Backbone.Model.extend({

  'defaults': {
    'item_name': 'Misc',
    'brand_name': 'None'
  }

});