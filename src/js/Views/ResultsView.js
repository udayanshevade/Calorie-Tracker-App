
var app = app || {};

/*
 * Results Page View
 */
app.FoodResultsView = Backbone.View.extend({

  // bind search results element
  'el': $('.food-results'),

  // initialize bindings
  'initialize': function() {
    this.$foodsContainer = this.$el.find('.foods');
    this.$foodsTitle = this.$foodsContainer.find('.results-title');
    this.$foodList = this.$el.find('#food-results');

    // render new added food result
    this.listenTo(app.foodResults, 'add', this.renderResult);
  },

  // fetch nutritionix data when user searches
  'fetchData': function(val) {
    this.fetchNutritionixData(val);
    $('#main').addClass('loading');
  },

  // query data from nutritionix api
  'fetchNutritionixData': function(val) {
    var that = this;

    this.$foodList.html('');

    var apiData = app.appView.nutritionixAPI;
    var url = apiData.base + 'search/' + val + apiData.suffix;

    $.getJSON(url).done(function(data) {

      if (data.hits.length) {

        that.$foodsTitle.html('search results:');
        // iterate and add each result
        data.hits.forEach(function(result, i) {
          for (var field in result.fields) {
            prop = result.fields[field];
            if (result.fields.hasOwnProperty(field)
              && typeof prop === 'number') {
              // prevent float values
              result.fields[field] = parseInt(prop);
            }
          }
          // gets rendered due to binding
          app.foodResults.add(result.fields);
        });
      }
      // if list is empty despite returning
      else {
        that.nutritionixErrorDisplay();
      }

      $('#main').removeClass('loading');

    }).fail(function() {
      that.nutritionixErrorDisplay();
      $('#main').removeClass('loading');
    });

  },

  // render each result item
  'renderResult': function(result) {
    var view = new app.FoodResultView({
      'model': result
    });
    this.$foodList.append(view.render().el);
  },

  // api callback error handling
  'nutritionixErrorDisplay': function() {
    this.$foodsTitle.html('No matching foods could be found at this time. Please try again later, or use a different search.');
  },

  // deselect single food result
  'deselectOne': function(foodResult) {
    foodResult.set({
      'selected': false
    });
  },

  // deselect all food result items
  'deselectAll': function() {
    app.foodResults.each(this.deselectOne, this);
  }

});

// initialize food results view
app.foodResultsView = new app.FoodResultsView();