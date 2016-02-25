
var app = app || {};

app.NutritionView = Backbone.View.extend({

  'el': '.nutrition-facts-container',

  'template': _.template($('#nutrition-facts-template').html()),

  'events': {
    'click .close-nutrition': 'nutritionClose',
    'click .slow-add': 'addFoodResult',
    'change .item-amount': 'updateItemAmount'
  },

  'initialize': function() {
    this.$input = this.$el.find('#item-amount');

    this.listenTo(this.model, 'change:item_id', this.render);
    this.listenTo(this.model, 'change:item_amount', this.render);
    this.listenTo(this.model, 'change:nutrition_visible', this.toggleNutrition);
  },

  'render': function() {
    this.toggleNutrition();
    this.$el.html(this.template(this.model.attributes));
    return this;
  },

  'toggleNutrition': function() {
    this.$el.toggleClass('nutrition-visible', this.model.get('nutrition_visible')).animate({
      'opacity': 1
    }, 200);
  },

  'nutritionClose': function() {
    this.model.set({
      'nutrition_visible': false
    });
    this.$el.animate({
      'opacity': 0
    });
  },

  'updateItemAmount': function() {
    this.model.set({
      'item_amount': parseInt($('.item-amount').val().trim())
    });
  },

  'addFoodResult': function() {
    var food = this.checkFoods();
    if (food) {
      food.save({
        'item_amount': food.get('item_amount') + this.model.get('item_amount')
      });
    } else {
      app.foods.add(this.model);
    }

    this.$el.find('.slow-add').addClass('added').delay(1500)
      .queue(function() {
        $(this).removeClass('added');
        $(this).dequeue();
        app.inputView.closeSearchMode();
      });
  },

  'checkFoods': function() {
    var currentID = this.model.get('item_id');
    var matchedFood = _.find(app.foods.models, function(food) {
      return food.get('item_id') === currentID;
    });
    return matchedFood;
  }

});

app.nutritionView = new app.NutritionView({
  'model': app.nutrition
});