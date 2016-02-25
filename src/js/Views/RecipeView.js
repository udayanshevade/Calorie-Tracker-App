
var app = app || {};

app.RecipeView = Backbone.View.extend({

  'el': $('.recipe-details-container'),

  'template': _.template($('#recipe-details-template').html()),

  'events': {
    'click .close-details': 'detailsClose'
  },

  'initialize': function() {
    var that = this;

    this.initializeChart();

    $(window).resize(function() {
      that.initializeChart();
      that.renderFlavors();
    });

    this.listenTo(this.model, 'change:title', this.render);
    this.listenTo(this.model, 'change:visible', this.openDetails);
  },

  'render': function() {
    this.openDetails();
    this.$el.html(this.template(this.model.attributes));
    this.initializeChart();
    this.renderFlavors();
    return this;
  },

  'initializeChart': function() {
    var that = this;

    this.flavorsData = [{
      'className': 'Flavors',
      'axes': []
    }];

    this.chartSide = $('.flavors-chart-container').width();

    if (this.svg) {
      this.svg.remove();
    } else {
      this.svg = d3.select('.flavors-chart-container').append('svg');
    }

    this.svg.attr('width', that.chartSide).attr('height', that.chartSide);
  },

  'renderFlavors': function() {
    if (this.model.get('flavors')) {
      var that = this;
      var flavors = this.model.get('flavors');

      for (var flavor in flavors) {
        if (flavors.hasOwnProperty(flavor)) {
          this.flavorsData[0].axes.push({
            'axis': flavor,
            'value': flavors[flavor]
          });
        }
      }

      this.chart = RadarChart.chart();
      this.svg.append('g').classed('focus', 1).datum(this.flavorsData);

      this.configureFlavorsChart();

      RadarChart.draw('.flavors-chart-container', that.flavorsData);
    }
  },

  'configureFlavorsChart': function() {
    var side = this.chartSide * 0.75;
    RadarChart.defaultConfig.containerClass = 'flavors-chart';
    RadarChart.defaultConfig.radius = 3;
    RadarChart.defaultConfig.w = side;
    RadarChart.defaultConfig.h = side;
    RadarChart.defaultConfig.maxValue = 1;
    RadarChart.defaultConfig.axisLine = false;
    RadarChart.defaultConfig.circles = false;
    RadarChart.defaultConfig.color = (function(){}); // color by css
  },

  'openDetails': function() {
    this.$el.toggleClass('recipe-visible', this.model.get('visible')).animate({
      'opacity': 1
    }, 200);
  },

  'detailsClose': function() {
    this.model.set({
      'visible': false
    });
    this.$el.animate({
      'opacity': 0
    });
  },

});

app.recipeView = new app.RecipeView({
  'model': app.recipe
});