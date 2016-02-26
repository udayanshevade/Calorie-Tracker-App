

var app = app || {};

/*
 * Calorie Count View
 */
app.CalorieCountView = Backbone.View.extend({

  // view container
  'el': $('#count'),

  // initialize calorie count
  'initialize': function() {
    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model, 'change:calories', this.toggleSeverity);
  },

  // render element
  'render': function() {
    // change mode
    if (this.model.get('countUp')) {
      this.$el.html(this.model.get('calories') + '<span class="count-type">cals eaten</span>');
    } else {
      var count = this.model.get('quota') - this.model.get('calories');
      this.$el.html(count + '<span class="count-type">cals left</span>');
    }
    return this;
  },

  // changes color if calorie count above limit
  // TODO: add customizeable limit
  'toggleSeverity': function() {
    this.$el.toggleClass('exceeded', (this.model.get('calories') > this.model.get('quota')));
  }

});