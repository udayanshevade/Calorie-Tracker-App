
var app = app || {};

/*
 * Recipe Results Section View
 */
app.RecipeResultsView = Backbone.View.extend({

  // bind wrapper element
  'el': $('.recipes-wrapper'),

  // DOM events for recipe results view
  'events': {
    'click .recipes-toggle': 'openRecipesMode',
    'click .close-recipes': 'closeRecipesMode',
    'submit #recipes-form': 'fetchData',
    'keydown #recipes-input': 'escape'
  },

  // initialize recipe results bindings
  'initialize': function() {
    this.$recipesContainer = this.$el.find('.recipes-inner-wrapper');
    this.$recipesList = this.$el.find('#recipes-list');
    this.$recipesTitle = this.$el.find('.results-title');
    this.$input = this.$el.find('#recipes-input');

    this.listenTo(this.model, 'change:visible', this.toggleRecipesView);
    // if recipe result model added, render it
    this.listenTo(app.recipeResults, 'add', this.renderResult);
  },

  // trim user input valand  fetch data
  'fetchData': function() {
    var val = this.$input.val();
    if (val) {
      this.fetchRecipesData(val);
    }
    return false;
  },

  // query yummly api
  'fetchRecipesData': function(val) {
    var that = this;
    this.$recipesList.html('');

    var apiData = app.appView.yummlyAPI;
    var url = apiData.base + 'recipes';

    $('#main').addClass('loading');

    $.getJSON(url, {
      'q': val,
      '_app_id': apiData.id,
      '_app_key': apiData.key
    }).done(function(data) {

      var matches = data.matches;

      if (matches.length) {

        // add background color for emphasis
        $('.recipes-open .results-inner-container').css('background-color', 'rgba(0,0,0,0.2');

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

      $('#main').removeClass('loading');

    }).fail(function() {
      that.recipesErrorDisplay();
      $('#main').removeClass('loading');
    });

  },

  // append recipe result list item
  'renderResult': function(result) {
    var view = new app.RecipeResultView({
      'model': result
    });

    this.$recipesList.append(view.render().el);
  },

  // recipes api error fallback handling
  'recipesErrorDisplay': function() {
    this.$el.find('.results-title').html('No matching recipes could be found at this time. Please try again later, or use a different search.');
  },

  // open recipes section
  'openRecipesMode': function() {
    this.model.openRecipesMode();
    this.$input.focus();
  },

  // hide recipes section
  'closeRecipesMode': function() {
    this.model.closeRecipesMode();
    this.$input.blur();
  },

  // open/close based on state
  'toggleRecipesView': function() {
    this.$el.toggleClass('recipes-open', this.model.get('visible'));
  },

  // escape shortcut
  'escape': function(e) {
    if (e.which === ESC_KEY) {
      this.closeRecipesMode();
    }
  },

  // deselect single food result
  'deselectOne': function(recipeResult) {
    recipeResult.set({
      'selected': false
    });
  },

  // deselect all food result items
  'deselectAll': function() {
    app.recipeResults.each(this.deselectOne, this);
  }

});