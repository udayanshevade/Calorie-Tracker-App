
var app = app || {};

app.RecipeView = Backbone.View.extend({

  'el': $('.recipe-details-container'),

  'template': _.template($('#recipe-details-template').html()),

  'events': {
    'click .close-details': 'detailsClose'
  },

  'initialize': function() {

    this.listenTo(this.model, 'change:title', this.render);
    this.listenTo(this.model, 'change:visible', this.openDetails);
  },

  'render': function() {
    this.openDetails();
    this.$el.html(this.template(this.model.attributes));
    if (this.model.get('flavors')) {
      this.renderFlavors();
    }
    return this;
  },

  'renderFlavors': function() {
    console.log('rendering flavors');
  },

  'openDetails': function() {
    this.$el.toggleClass('recipe-visible', this.model.get('visible')).animate({
      'opacity': 1
    }, 200);
  },

  'detailsClose': function() {
    this.model.set({
      'visible': false
    });
    this.$el.animate({
      'opacity': 0
    });
  },

});

app.recipeView = new app.RecipeView({
  'model': app.recipe
});