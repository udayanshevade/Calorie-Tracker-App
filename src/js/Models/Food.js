
var app = app || {};

/**
 * Define Food Model
 * these will occupy the foods collection
 */
app.Food = Backbone.Model.extend({

  // default attributes
  // misc titles in case the user doesn't have a title for custom additions
  'defaults': {
    'item_name': 'Misc',
    'brand_name': 'None'
  }

});