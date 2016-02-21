
var app = app || {};

app.FoodResultView = Backbone.View.extend({

  'tagName': 'li',

  'template': _.template($('#food-result-template').html()),

  'events': {
    'click .result': 'displayItemData',
    'click .quick-add': 'quickAdd'
  },

  'initialize': function() {
    this.listenTo(this.model, 'change:selected', this.highlight)
  },

  'render': function() {
    this.$el.html(this.template(this.model.attributes));
    return this;
  },

  'displayItemData': function() {
    this.findItemData();
  },

  'findItemData': function() {

    app.foodResultsView.deselectAll();

    this.model.toggleSelected();

    var apiData = app.appView.nutritionixAPI;
    var url = apiData.base + 'item/';

    if (this.model.get('item_id') === app.nutrition.get('item_id')) {

      app.nutrition.nutritionExpand();

    } else {
      $.getJSON(url, {
        'id': this.model.get('item_id'),
        'appId': apiData.id,
        'appKey': apiData.key
      }).done(function(data) {
        app.nutrition.nutritionExpand();
        app.nutrition.set(data);
      }).fail(function() {
        console.log('nah nah');
      });
    }

  },

  'highlight': function() {
    this.$el.find('.food-result').toggleClass('selected', this.model.get('selected'));
  },

  'quickAdd': function() {
    var food = this.checkFoods();
    if (food) {
      food.set({
        'item_amount': parseInt(food.get('item_amount')) + 1
      });

    } else {
      app.foods.add(this.model);
    }

    this.$el.find('.quick-add').addClass('added').delay(1500)
      .queue(function() {
        $(this).removeClass('added').dequeue();
      });

    return false;
  },

  'checkFoods': function() {
    var currentID = this.model.get('item_id');
    var matchedFood = _.find(app.foods.models, function(food) {
      return food.get('item_id') === currentID;
    });
    return matchedFood;
  }


});