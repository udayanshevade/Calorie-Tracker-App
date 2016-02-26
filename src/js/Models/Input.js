
var app = app || {};

/*
 * Model for input logic
 */
app.Input = Backbone.Model.extend({

  // default attributes
  defaults: {
    'visible': false,
  },

  // expands search mode
  openSearchMode: function() {
    this.set({
      'visible': true
    });
  },

  // collapses search mode
  closeSearchMode: function() {
    this.set({
      'visible': false
    });
  }

});

app.input = new app.Input();