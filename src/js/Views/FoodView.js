

var app = app || {};

/*
 * Added Food Item View
 */
app.FoodView = Backbone.View.extend({

  // create a new list element
  'tagName': 'li',

  // DOM events for the added food list items
  'events': {
    'click .remove-food': 'removeFood',
    'change .item-amount': 'updateAmount',
  },

  // cache template
  'template': _.template($('#food-template').html()),

  // initialize bindings
  'initialize': function() {
    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model, 'change:item_amount', this.triggerCalorieUpdate);
    this.listenTo(this.model, 'destroy', this.removeFoodView);
  },

  // re-render the added food data
  'render': function() {
    this.$el.html(this.template(this.model.attributes));
    return this;
  },

  // destroy added food model
  'removeFood': function() {
    this.model.destroy();
  },

  // dispose of associated DOM element, to prevent glitchy duplication
  'removeFoodView': function() {
    this.$el.remove();
  },

  // update amount only
  'updateAmount': function() {
    this.$amount = this.$el.find('.item-amount');

    this.model.set({
      'item_amount': this.$amount.val()
    });
  },

  // trigger calorie updates
  'triggerCalorieUpdate': function() {
    app.calorieCount.updateCalories();
    app.appView.updateDate();
  }


});