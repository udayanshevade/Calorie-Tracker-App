
var app = app || {};

/*
 * Food Search Result Item View
 */
app.FoodResultView = Backbone.View.extend({

  // create a new list element
  'tagName': 'li',

  // use template defined in index.html
  'template': _.template($('#food-result-template').html()),

  // DOM events for the result item
  'events': {
    'click .result': 'displayItemData',
    'click .quick-add': 'quickAdd'
  },

  // initialize bindings
  'initialize': function() {
    this.listenTo(this.model, 'change:selected', this.highlight)
  },

  // render the result list item
  'render': function() {
    this.$el.html(this.template(this.model.attributes));
    return this;
  },

  // calls findItemData
  'displayItemData': function() {
    this.findItemData();
  },

  // queries nutritionix api for specific item data
  'findItemData': function() {

    // deselects all food items
    app.foodResultsView.deselectAll();

    // highlights current one
    this.model.toggleSelected();

    var apiData = app.appView.nutritionixAPI;
    var url = apiData.base + 'item/';
    $('#main').addClass('loading');

    // if item data is currently cached, just expand the nutrition view
    if (this.model.get('item_id') === app.nutrition.get('item_id')) {

      app.nutrition.nutritionExpand();
      $('#main').removeClass('loading');

    } else {
      // else make a new query
      $.getJSON(url, {
        'id': this.model.get('item_id'),
        'appId': apiData.id,
        'appKey': apiData.key
      }).done(function(data) {
        app.nutrition.set(data);
        app.nutrition.nutritionExpand();
        $('#main').removeClass('loading');
      }).fail(function() {
        $('.nutrition-facts-container').html('<h2 class="results-title">The nutrition data for this food could not be returned at this time. Please try again later.</h2>');
        $('#main').removeClass('loading');
      });
    }

  },

  // highlights the chosen food result item
  'highlight': function() {
    this.$el.find('.food-result').toggleClass('selected', this.model.get('selected'));
  },

  // quick adds the result food
  'quickAdd': function() {
    var food = this.checkFoods();
    if (food) {
      food.set({
        'item_amount': parseInt(food.get('item_amount')) + 1
      });

    } else {
      app.foods.add(this.model);
    }

    this.$el.find('.quick-add').addClass('added').delay(750)
      .queue(function() {
        $(this).removeClass('added')
        $(this).dequeue();
        app.inputView.closeSearchMode();
      });

    return false;
  },

  // scans existing foods to see if the model already exists
  // prevents duplicates
  'checkFoods': function() {
    var currentID = this.model.get('item_id');
    var matchedFood = _.find(app.foods.models, function(food) {
      return food.get('item_id') === currentID;
    });
    return matchedFood;
  }


});