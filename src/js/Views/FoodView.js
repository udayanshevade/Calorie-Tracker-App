

var app = app || {};

app.FoodView = Backbone.View.extend({

  'tagName': 'li',

  'events': {
    'click': 'logModel',
    'click .remove-food': 'removeFood',
    'change .item-amount': 'updateAmount',
  },

  'template': _.template($('#food-template').html()),

  'initialize': function() {
    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model, 'change:item_amount', this.triggerCalorieUpdate);
    this.listenTo(this.model, 'destroy', this.removeFoodView);
  },

  'render': function() {
    this.$el.html(this.template(this.model.attributes));
    return this;
  },

  'logModel': function() {
    console.log(this.model);
  },

  'removeFood': function() {
    this.model.destroy();
  },

  'removeFoodView': function() {
    this.$el.remove();
  },

  'updateAmount': function() {
    this.$amount = this.$el.find('.item-amount');

    this.model.set({
      'item_amount': this.$amount.val()
    });
  },

  'triggerCalorieUpdate': function() {
    app.calorieCount.updateCalories();
    app.appView.updateDate();
  }


});