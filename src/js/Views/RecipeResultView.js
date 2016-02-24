
var app = app || {};

app.RecipeResultView = Backbone.View.extend({

  'tagName': 'li',

  'template': _.template($('#recipe-result-template').html()),

  'events': {
    'click': 'fetchRecipeData'
  },

  'initialize': function() {
    this.listenTo(this.model, 'change:selected', this.highlight)
  },

  'render': function() {
    this.$el.html(this.template(this.model.attributes));
    return this;
  },

  'fetchRecipeData': function() {

    if (this.model.get('id') != app.recipe.get('id')) {
      var apiData = app.appView.yummlyAPI;
      var url = apiData.base + 'recipe/' + this.model.get('id');

      $.getJSON(url, {
        '_app_id': apiData.id,
        '_app_key': apiData.key
      }).done(function(data) {

        var obj = {
          'title': data.name,
          'img': data.images[0].hostedLargeUrl,
          'time': data.totalTime,
          'yield': data.yield,
          'source': data.source.sourceDisplayName,
          'sourceURL': data.source.sourceRecipeUrl,
          'ingredients': data.ingredientLines,
          'yummly': data.attribution.html,
          'flavors': data.flavors
        };

        app.recipe.recipeOpen();
        app.recipe.set(obj);
      }).fail(function() {
        console.log('recipe get failed')
      });
    } else {
      app.recipe.recipeOpen();
    }
  },

  'highlight': function() {
    this.$el.find('.recipe-result').toggleClass('selected', this.model.get('selected'));
  },

});