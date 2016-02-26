
var app = app || {};

/*
 * Nutrition view
 */
app.NutritionView = Backbone.View.extend({

  // bind to nutrition facts container
  'el': '.nutrition-facts-container',

  // cache template for reuse
  'template': _.template($('#nutrition-facts-template').html()),

  // DOM events for nutrition details view
  'events': {
    'click .close-nutrition': 'nutritionClose',
    'click .slow-add': 'addFoodResult',
    'change .item-amount': 'updateItemAmount'
  },

  // initialize view bindings
  'initialize': function() {
    this.$input = this.$el.find('#item-amount');
    // when changed, re-render the nutrition details
    this.listenTo(this.model, 'change:item_id', this.render);
    this.listenTo(this.model, 'change:item_amount', this.render);
    this.listenTo(this.model, 'change:nutrition_visible', this.toggleNutrition);
  },

  // render nutrition details
  'render': function() {
    this.toggleNutrition();
    this.$el.html(this.template(this.model.attributes));
    return this;
  },

  // open/close nutrition data container
  'toggleNutrition': function() {
    this.$el.toggleClass('nutrition-visible', this.model.get('nutrition_visible')).animate({
      'opacity': 1
    }, 200);
  },

  // hide nutrition section
  'nutritionClose': function() {
    this.model.set({
      'nutrition_visible': false
    });
    // animate opacity for added feel
    this.$el.animate({
      'opacity': 0
    });
  },

  // update item amount
  'updateItemAmount': function() {
    this.model.set({
      'item_amount': parseInt($('.item-amount').val().trim())
    });
  },

  // add food item to list of other added foods
  'addFoodResult': function() {
    var food = this.checkFoods();
    // if food has already been added, alter the existing model
    if (food) {
      food.save({
        'item_amount': food.get('item_amount') + this.model.get('item_amount')
      });
    // else create a new model
    } else {
      this.model.set({
        'nf_calories': Math.ceil(this.model.get('nf_calories'))
      })
      app.foods.add(this.model);
    }
    // close add screen
    this.$el.find('.slow-add').addClass('added').delay(750)
      .queue(function() {
        $(this).removeClass('added');
        $(this).dequeue();
        app.inputView.closeSearchMode();
      });
  },

  // check if food model already exists
  'checkFoods': function() {
    var currentID = this.model.get('item_id');
    var matchedFood = _.find(app.foods.models, function(food) {
      return food.get('item_id') === currentID;
    });
    return matchedFood;
  }

});

// new nutrition view object
app.nutritionView = new app.NutritionView({
  'model': app.nutrition
});