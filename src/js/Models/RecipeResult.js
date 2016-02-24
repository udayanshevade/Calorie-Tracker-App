
var app = app || {};

app.Recipe = Backbone.Model.extend({

  'defaults': {
    'selected': false,
    'title': '',
    'time': 0,
    'img': '',
    'source': '',
    'ingredients': [],
    'id': '',
    'flavors': null
  },

  'toggleSelected': function() {
    this.set({
      'selected': !this.get('selected')
    });
  }


});