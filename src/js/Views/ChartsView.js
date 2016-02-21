

var app = app || {};

app.ChartsView = Backbone.View.extend({

  'el': $('.charts-wrapper'),

  'events': {
    'click .close-charts': 'closeChartsMode'
  },

  'initialize': function() {
    this.listenTo(this.model, 'change:visible', this.toggleChartsMode);
  },

  'render': function() {
    return this;
  },

  'toggleChartsMode': function() {
    this.$el.toggleClass('charts-open', this.model.get('visible'));
  },

  'closeChartsMode': function() {
    this.model.set({
      'visible': false
    });
  }

});