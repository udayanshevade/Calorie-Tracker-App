

var app = app || {};

app.CalorieCountView = Backbone.View.extend({

  'el': $('#count'),

  'initialize': function() {
    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model, 'change:calories', this.toggleSeverity);
  },

  'render': function() {
    if (this.model.get('countUp')) {
      this.$el.html(this.model.get('calories') + '<span class="count-type">cals eaten</span>');
    } else {
      var count = this.model.get('quota') - this.model.get('calories');
      this.$el.html(count + '<span class="count-type">cals left</span>');
    }
    return this;
  },

  'toggleSeverity': function() {
    this.$el.toggleClass('exceeded', (this.model.get('calories') > this.model.get('quota')));
  }

});