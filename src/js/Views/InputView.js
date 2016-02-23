
var app = app || {};

app.InputView = Backbone.View.extend({

  'el': $('#search-container'),

  'events': {
    'focus #search-form': 'openSearchMode',
    'click #close-search': 'closeSearchMode',
    'submit #search-form': 'fetchData',
    'keydown': 'escape'
  },

  'initialize': function() {
    this.$input = this.$el.find('#search-input');
    this.$manual = this.$el.find('.manual-outer-wrapper');

    this.listenTo(this.model, 'change:visible', this.toggleShow);

  },

  'toggleShow': function() {
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

  'openSearchMode': function() {
    this.model.openSearchMode();
  },

  'closeSearchMode': function() {
    this.model.closeSearchMode();
    this.$input.blur();
  },

  'fetchData': function() {
    var val = this.$input.val();
    if (val) {
      app.foodResultsView.fetchData(val);
    }
    return false;
  },

  'escape': function(e) {
    if (e.which === ESC_KEY) {
      this.closeSearchMode();
    }
  }

});