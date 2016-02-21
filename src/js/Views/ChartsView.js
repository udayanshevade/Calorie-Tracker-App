

var app = app || {};

app.ChartsView = Backbone.View.extend({

  'el': $('.charts-wrapper'),

  'events': {
    'click .close-charts': 'closeChartsMode'
  },

  'initialize': function() {
    this.listenTo(this.model, 'change:visible', this.toggleChartsMode);

    this.initializeArc();
  },

  'render': function() {
    return this;
  },

  'initializeArc': function() {
    var that = this,
      width = 250,
      height = 250;

    this.tau = 2 * Math.PI;

    this.arcFunction = d3.svg.arc()
      .innerRadius(width / 2 - 60)
      .outerRadius(width / 2 - 20)
      .startAngle(0);


    var svg = d3.select('.calorie-radial-container').append('svg')
      .attr('width', width)
      .attr('height', width)
      .append('g')
      .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

    var background = svg.append('path')
      .datum({'endAngle': that.tau})
      .style('fill', '#f0f0f0')
      .attr('d', that.arcFunction);

    this.calorieArc = svg.append('path')
      .datum({'endAngle': that.tau * 0})
      .style('fill', 'lightgreen')
      .attr('d', that.arcFunction);

    that.calorieCount = svg.append('text')
      .attr('class', 'calorie-radial-label')
      .style('fill', '#dcedc8')
      .style('text-anchor', 'middle');

    var dailyCount = svg.append('text')
      .text('daily')
      .attr('class', 'calorie-radial-title')
      .style('fill', '#fff')
      .attr('y', width / 2)
      .attr('x', -35)

  },

  'updateArc': function() {
    var that = this;
    this.calorieArc.datum({'endAngle': 0});
    var cals = app.date.get('calories') || 0;

    this.calorieArc.transition()
      .delay(450)
      .duration(750)
      .call(that.arcTween, that.tau * cals / 2000, that); // TODO: add customizable limit

    this.calorieCount.datum({'cals': cals});

    this.calorieCount.transition()
      .delay(450)
      .duration(750)
      .tween('text', function(d) {
        var i = d3.interpolate(0, d.cals);

        return function(t) {
          this.textContent = Math.round(i(t));
        }

      });

  },

  'toggleChartsMode': function() {
    this.$el.toggleClass('charts-open', this.model.get('visible'));
    this.updateArc();
  },

  'closeChartsMode': function() {
    this.model.set({
      'visible': false
    });
  },

  'arcTween': function(transition, newAngle, that) {

    transition.attrTween("d", function(d) {

      var interpolate = d3.interpolate(d.endAngle, newAngle);

      return function(t) {

        d.endAngle = interpolate(t);

        return that.arcFunction(d);
      };

    });
  }

});