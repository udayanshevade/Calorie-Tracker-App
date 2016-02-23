
var app = app || {};

app.RecipeResultsView = Backbone.View.extend({

  'el': $('.recipes-wrapper'),

  'events': {
    'click .recipes-toggle': 'openRecipesMode',
    'click .close-recipes': 'closeRecipesMode',
    'submit #recipes-form': 'fetchData',
    'keydown #recipes-input': 'escape'
  },

  'initialize': function() {
    this.$recipesContainer = this.$el.find('.recipes-inner-wrapper');
    this.$recipesList = this.$el.find('#recipes-list');
    this.$recipesTitle = this.$el.find('.results-title');
    this.$input = this.$el.find('#recipes-input');

    this.listenTo(this.model, 'change:visible', this.toggleRecipesView);
    this.listenTo(app.recipeResults, 'add', this.renderResult);
  },

  'fetchData': function() {
    var val = this.$input.val();
    if (val) {
      this.fetchRecipesData(val);
    }
    return false;
  },

  'fetchRecipesData': function(val) {
    var that = this;
    this.$recipesList.html('');

    var apiData = app.appView.NYTrecipesAPI;

    $.getJSON(apiData.base, {
      'q': val,
      'fq': 'type_of_material:(' + apiData.material + ')',
      'fl': apiData.fl,
      'api-key': apiData.key
    }).done(function(data) {

      var docs = data.response.docs;

      if (docs.length) {

        that.$el.find('.results-title').html('recipe results:');

        docs.forEach(function(result, i) {
          app.recipeResults.add(result);
        });

      } else {
        that.recipesErrorDisplay();
      }
    }).fail(function() {
      that.recipesErrorDisplay();
    });

  },

  'renderResult': function(result) {
    var view = new app.RecipeResultView({
      'model': result
    });

    this.$recipesList.append(view.render().el);
  },

  'recipesErrorDisplay': function() {
    this.$el.find('.results-title').html('No matching recipes could be found at this time. Please try again later, or use a different search.');
  },

  'openRecipesMode': function() {
    this.model.openRecipesMode();
    this.$input.focus();
  },

  'closeRecipesMode': function() {
    this.model.closeRecipesMode();
    this.$input.blur();
  },

  'toggleRecipesView': function() {
    this.$el.toggleClass('recipes-open', this.model.get('visible'));
  },

  'escape': function(e) {
    if (e.which === ESC_KEY) {
      this.closeRecipesMode();
    }
  }

});