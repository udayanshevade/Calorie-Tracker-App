
var app = app || {};

/*
 * Main search input view
 */
app.InputView = Backbone.View.extend({

  // bind search container element
  'el': $('#search-container'),

  // DOM events for the input view
  'events': {
    'focus #search-form': 'openSearchMode',
    'click #close-search': 'closeSearchMode',
    'submit #search-form': 'fetchData',
    'keydown': 'escape'
  },

  // initialize input bindings
  'initialize': function() {
    this.$input = this.$el.find('#search-input');
    this.$manual = this.$el.find('.manual-outer-wrapper');

    // toggle visibility
    this.listenTo(this.model, 'change:visible', this.toggleSearchMode);

  },

  // opens/closes search mode and animates
  'toggleSearchMode': function() {
    if ( this.model.get('visible') ) {
      this.$el.addClass('open');
      app.foodResultsView.$el.show().delay(250).animate({
        opacity: 1
      }, 150);
    } else {
      this.$el.removeClass('open');
      app.foodResultsView.$el.hide().css({
        opacity: 0
      });
    }
  },

  // opens search mode
  'openSearchMode': function() {
    this.model.openSearchMode();
  },

  // closes search mode
  'closeSearchMode': function() {
    this.model.closeSearchMode();
    // exit the input to allow expansion effect to work
    this.$input.blur();
  },

  // trigger fetch data when input submitted
  'fetchData': function() {
    var val = this.$input.val();
    if (val) {
      app.foodResultsView.fetchData(val);
    }
    return false;
  },

  // escape shortcut
  'escape': function(e) {
    if (e.which === ESC_KEY) {
      this.closeSearchMode();
    }
  }

});