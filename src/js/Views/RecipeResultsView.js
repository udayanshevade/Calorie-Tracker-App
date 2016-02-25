
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

    var apiData = app.appView.yummlyAPI;
    var url = apiData.base + 'recipes';

    $.getJSON(url, {
      'q': val,
      '_app_id': apiData.id,
      '_app_key': apiData.key
    }).done(function(data) {

      var matches = data.matches;

      if (matches.length) {

        $('.recipes-open .results-inner-container').css('background-color', 'rgba(0,0,0,0.4');

        that.$el.find('.results-title').html('recipe results:');

        var obj = {};
        var recipeData;

        matches.forEach(function(result, i) {
          obj = {
            'title': result.recipeName,
            'time': result.totalTimeInSeconds,
            'source': result.sourceDisplayName,
            'ingredients': result.ingredients,
            'id': result.id
          };
          if (result.imageUrlsBySize) obj.img = result.imageUrlsBySize['90'];
          app.recipeResults.add(obj);
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

  'recipeErrorDisplay': function() {
    //
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