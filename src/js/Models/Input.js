
var app = app || {};

(function() {

  app.Input = Backbone.Model.extend({
    defaults: {
      'visible': false,
    },

    openSearchMode: function() {
      this.set({
        'visible': true
      });
    },


    closeSearchMode: function() {
      this.set({
        'visible': false
      });
    }

  });

  app.input = new app.Input();

})();