
var app = app || {};

app.RecipeResultView = Backbone.View.extend({

  'tagName': 'li',

  'template': _.template($('#recipe-result-template').html()),

  'render': function() {
    this.$el.html(this.template(this.model.attributes));
    return this;
  },

});