
var app = app || {};

(function() {

  app.ManualInput = Backbone.Model.extend({

    'defaults': {
      'visible': false
    },

    'openManualMode': function() {
      this.set({
        'visible': true
      });
    },

    'closeManualMode': function() {
      this.set({
        'visible': false
      });
    }

  });

  app.manualInput = new app.ManualInput();

})();