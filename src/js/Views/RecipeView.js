
var app = app || {};

/*
 * Detailed recipe view
 */
app.RecipeView = Backbone.View.extend({

  // bind to details container
  'el': $('.recipe-details-container'),

  // cache template
  'template': _.template($('#recipe-details-template').html()),

  // DOM events
  'events': {
    'click .close-details': 'detailsClose'
  },

  // initialize bindings
  'initialize': function() {
    var that = this;

    // initialize flavors chart
    this.initializeChart();

    // resize chart if necessary
    $(window).resize(function() {
      that.initializeChart();
      that.renderFlavors();
    });

    // if title of recipe changes, re-render new recipe
    this.listenTo(this.model, 'change:title', this.render);
    this.listenTo(this.model, 'change:visible', this.openDetails);
  },

  // render details
  'render': function() {
    this.openDetails();
    this.$el.html(this.template(this.model.attributes));
    this.initializeChart();
    this.renderFlavors();
    return this;
  },

  // initialize chart for reuse
  'initializeChart': function() {
    var that = this;

    this.flavorsData = [{
      'className': 'Flavors',
      'axes': []
    }];

    this.chartSide = $('.flavors-chart-container').width();

    // remove an existing svg element
    if (this.svg) {
      this.svg.remove();
    }

    this.svg = d3.select('.flavors-chart-container').append('svg')
      .attr('width', that.chartSide)
      .attr('height', that.chartSide);
  },

  // render flavors chart
  'renderFlavors': function() {
    if (this.model.get('flavors')) {
      var that = this;
      var flavors = this.model.get('flavors');

      for (var flavor in flavors) {
        if (flavors.hasOwnProperty(flavor)) {
          // massage data object for the radar chart plugin
          this.flavorsData[0].axes.push({
            'axis': flavor,
            'value': flavors[flavor]
          });
        }
      }

      // reassign chart
      this.chart = RadarChart.chart();
      this.svg.append('g').classed('focus', 1).datum(this.flavorsData);

      this.configureFlavorsChart();

      // render radar chart of flavors
      RadarChart.draw('.flavors-chart-container', that.flavorsData);
    }
  },

  // configure chart properties
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

  // open details view
  'openDetails': function() {
    this.$el.toggleClass('recipe-visible', this.model.get('visible')).animate({
      'opacity': 1
    }, 200);
  },

  // close details view
  'detailsClose': function() {
    this.model.set({
      'visible': false
    });
    this.$el.animate({
      'opacity': 0
    });
  },

  // error handling for recipes item api
  'errorDisplay': function() {
    this.$el.html('<h2 class="results-title">The details for this recipe could not be returned at this time. Please try again later.</h2>');
  }

});

// initialize new recipe view
app.recipeView = new app.RecipeView({
  'model': app.recipe
});