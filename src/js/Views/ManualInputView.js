

var app = app || {};

app.ManualInputView = Backbone.View.extend({

  'el': $('.manual-add-wrapper'),

  'events': {
    'click .close-manual': 'closeManualMode',
    'submit': 'manualAdd',
    'keydown': 'escape'
  },

  'initialize': function() {
    this.$amountInput = this.$el.find('.manual-amount');
    this.$calsInput = this.$el.find('.manual-calories');
    this.$itemInput = this.$el.find('.manual-item');
    this.$brandInput = this.$el.find('.manual-brand');

    this.listenTo(this.model, 'change:visible', this.toggleShow);
  },

  'toggleShow': function() {
    if ( this.model.get('visible') ) {
      this.$el.addClass('manual-open');
      this.$amountInput.focus();
    } else {
      this.$el.removeClass('manual-open');
    }
  },

  'closeManualMode': function() {
    this.model.set({
      'visible': false
    });
  },

  'manualAdd': function() {

    var food = {};

    var amount = parseInt($(this.$amountInput).val());
    var cals = parseInt($(this.$calsInput).val());
    var item = $(this.$itemInput).val();
    var brand = $(this.$brandInput).val();

    if (amount && cals) {

      food.item_amount = amount;
      food.nf_calories = cals;

      if (item) food.item_name = item;
      if (brand) food.brand_name = brand;

      var foodModel = new app.Food(food);

      app.foods.add(foodModel);

      this.clearManualForm();

      this.closeManualMode();

    } else {
      this.manualAddError();
    }

    return false;

  },

  'clearManualForm': function() {
    this.$amountInput.val('');
    this.$calsInput.val('');
    this.$itemInput.val('');
    this.$brandInput.val('');
  },

  'manualAddError': function() {
    console.log('not so fast criminal scum');
  },

  'escape': function(e) {
    if (e.which === ESC_KEY) {
      this.closeManualMode();
    }
  }

});