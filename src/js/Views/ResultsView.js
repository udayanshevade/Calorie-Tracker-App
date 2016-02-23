
var app = app || {};

app.ResultsView = Backbone.View.extend({

  'el': $('.search-results'),

  'initialize': function() {
    this.$foodsContainer = this.$el.find('.foods');
    this.$foodsTitle = this.$foodsContainer.find('.results-title');
    this.$foodList = this.$el.find('#food-results');

    this.listenTo(app.foodResults, 'add', this.renderResult);

  },

  'fetchData': function(val) {
    this.fetchNutritionixData(val);
  },

  'fetchNutritionixData': function(val) {
    var that = this;

    this.$foodList.html('');

    var apiData = app.appView.nutritionixAPI;
    var url = apiData.base + 'search/' + val + apiData.suffix;

    $.getJSON(url).done(function(data) {

      if (data.hits.length) {

        that.$foodsTitle.html('search results:');

        data.hits.forEach(function(result, i) {
          for (var field in result.fields) {
            prop = result.fields[field];
            if (result.fields.hasOwnProperty(field)
              && typeof prop === 'number') {
              result.fields[field] = parseInt(prop);
            }
          }
          app.foodResults.add(result.fields);
        });
      }

      else {
        that.nutritionixErrorDisplay();
      }

    }).fail(function() {
      that.nutritionixErrorDisplay();
    });

  },

  'renderResult': function(result) {

    var view = new app.FoodResultView({
      'model': result
    });

    this.$foodList.append(view.render().el);

  },

  'nutritionixErrorDisplay': function() {
    this.$foodsTitle.html('No matching foods could be found at this time. Please try again later, or use a different search.');
  },

  'deselectOne': function(foodResult) {
    foodResult.set({
      'selected': false
    });
  },

  'deselectAll': function() {
    app.foodResults.each(this.deselectOne, this);
  }

});

app.foodResultsView = new app.ResultsView();