

var app = app || {};

/*
 * Added food items collection
 */
app.Foods = Backbone.Collection.extend({

  // uses food model
  'model': app.Food,

  'initialize': function() {
    this.$mainFoodsList = $('.main-foods-list');
  },

  // add single food
  'addFood': function(food) {
    // create a new food view
    food.view = new app.FoodView({
      'model': food
    });
    this.$mainFoodsList.append(food.view.render().el);
  },

  // remove foods from collection
  'clearFoods': function() {
    app.foods.clearFoodViews();
    app.foods.reset();
  },

  // remove associated food views
  'clearFoodViews': function() {
    app.foods.each(function(food) {
      food.view.removeFoodView();
    });
  },

});

app.foods = new app.Foods();