
var app = app || {};

/*
 * Individual recipe result view
 */
app.RecipeResultView = Backbone.View.extend({

  // create new list item element
  'tagName': 'li',

  // cache template
  'template': _.template($('#recipe-result-template').html()),

  // DOM events
  'events': {
    'click': 'fetchRecipeData'
  },

  // bind model events
  'initialize': function() {
    this.listenTo(this.model, 'change:selected', this.highlight);
  },

  // render element
  'render': function() {
    this.$el.html(this.template(this.model.attributes));
    return this;
  },

  // fetch additional recipe details
  'fetchRecipeData': function() {

    // deselects all food items
    app.recipeResultsView.deselectAll();

    // highlights current one
    this.model.toggleSelected();

    $('#main').addClass('loading');

    if (this.model.get('id') != app.recipe.get('id')) {
      var apiData = app.appView.yummlyAPI;
      var url = apiData.base + 'recipe/' + this.model.get('id');
      // unless same recipe data exists, fetch data
      $.getJSON(url, {
        '_app_id': apiData.id,
        '_app_key': apiData.key
      }).done(function(data) {

        var flavors = {};

        // massage data object for radar chart
        for (var flavor in data.flavors) {
          switch (flavor) {
            case 'Piquant':
              flavors.Spicy = data.flavors[flavor];
              break;
            case 'Meaty':
              flavors.Savory = data.flavors[flavor];
              break;
            default:
              flavors[flavor] = data.flavors[flavor];
              break;
          }
        }
        // object details to render via template
        var obj = {
          'title': data.name,
          'img': data.images[0].hostedLargeUrl,
          'time': data.totalTime,
          'yield': data.yield,
          'source': data.source.sourceDisplayName,
          'sourceURL': data.source.sourceRecipeUrl,
          'ingredients': data.ingredientLines,
          'yummly': data.attribution.html,
          'flavors': flavors
        };

        // open and set details for rendering
        app.recipe.recipeOpen();
        app.recipe.set(obj);
        $('#main').removeClass('loading');
      }).fail(function() {
        app.recipeView.errorDisplay();
        app.recipe.recipeOpen();
        $('#main').removeClass('loading');
      });
    } else {
      // or just open the existing data
      app.recipe.recipeOpen();
      $('#main').removeClass('loading');
    }
  },

  // highlight current selected recipe
  'highlight': function() {
    this.$el.find('.recipe-result').toggleClass('selected', this.model.get('selected'));
  },

});