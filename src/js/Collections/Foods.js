

var app = app || {};

app.Foods = Backbone.Collection.extend({

  'model': app.Food,

  'initialize': function() {
    this.$mainFoodsList = $('.main-foods-list');
  },

  'addFood': function(food) {
    food.view = new app.FoodView({
      'model': food
    });
    this.$mainFoodsList.append(food.view.render().el);
  },

  'clearFoods': function() {
    app.foods.clearFoodViews();
    app.foods.reset();
  },

  'clearFoodViews': function() {
    app.foods.each(function(food) {
      food.view.removeFoodView();
    });
  },

});

app.foods = new app.Foods();