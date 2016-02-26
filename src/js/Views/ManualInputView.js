

var app = app || {};

/*
 * Manual input mode view
 */
app.ManualInputView = Backbone.View.extend({

  // bind to manual add DOM element
  'el': $('.manual-add-wrapper'),

  // DOM events for manual addition
  'events': {
    'click .close-manual': 'closeManualMode',
    'submit': 'manualAdd',
    'keydown': 'escape'
  },

  // initialize bindings
  'initialize': function() {
    this.$amountInput = this.$el.find('.manual-amount');
    this.$calsInput = this.$el.find('.manual-calories');
    this.$itemInput = this.$el.find('.manual-item');
    this.$brandInput = this.$el.find('.manual-brand');

    this.listenTo(this.model, 'change:visible', this.toggleManualMode);
  },

  // open/close manual mode
  'toggleManualMode': function() {
    if ( this.model.get('visible') ) {
      this.$el.addClass('manual-open');
      this.$amountInput.focus();
    } else {
      this.$el.removeClass('manual-open');
    }
  },

  // close manual mode specifically
  'closeManualMode': function() {
    this.model.set({
      'visible': false
    });
  },

  // manual addition
  'manualAdd': function() {

    var food = {};

    // collect inputs
    var amount = parseInt($(this.$amountInput).val());
    var cals = parseInt($(this.$calsInput).val());
    var item = $(this.$itemInput).val();
    var brand = $(this.$brandInput).val();

    // if bare minimum are present
    if (amount && cals) {

      // assign values to the added food item
      food.item_amount = amount;
      food.nf_calories = cals;

      if (item) food.item_name = item;
      if (brand) food.brand_name = brand;

      var foodModel = new app.Food(food);

      // create/add new food
      app.foods.add(foodModel);

      // empty form
      this.clearManualForm();

      // close form
      this.closeManualMode();

    } else {
      // otherwise signal user error
      this.manualAddError();
    }

    return false;

  },

  // empty form
  'clearManualForm': function() {
    this.$amountInput.val('');
    this.$calsInput.val('');
    this.$itemInput.val('');
    this.$brandInput.val('');
  },

  // highlight user error feedback
  'manualAddError': function() {
    var that = this;
    $('.manual-add-error').addClass('error');
    setTimeout(that.clearError, 1500);
  },

  'clearError': function() {
    $('.manual-add-error').removeClass('error');
  },

  // escape shortcut
  'escape': function(e) {
    if (e.which === ESC_KEY) {
      this.closeManualMode();
    }
  }

});