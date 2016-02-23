

var app = app || {};

app.ChartsView = Backbone.View.extend({

  'el': $('.charts-wrapper'),

  'events': {
    'click .close-charts': 'closeChartsMode',
    'click .period-toggle': 'changeGraphPeriod'
  },

  'initialize': function() {
    this.$graphContainer = this.$el.find('.calorie-graph-container');

    this.listenTo(this.model, 'change:visible', this.toggleChartsMode);
    this.listenTo(this.model, 'change:period', function() {
      this.updateGraph(this.model.get('period'));
    });

    this.initializeArc();
  },

  'render': function() {
    return this;
  },

  'initializeArc': function() {
    var that = this,
      width = 240,
      height = 240;

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
      .text('today')
      .attr('class', 'calorie-radial-title')
      .style('fill', '#fff')
      .attr('y', width / 2)
      .attr('x', -25)

  },

  'updateArc': function() {
    var that = this;
    this.calorieArc.datum({'endAngle': 0});
    var cals = app.date.get('calories') || 0;

    this.calorieArc.transition()
      .delay(150)
      .duration(750)
      .call(that.arcTween, that.tau * cals / 2000, that); // TODO: add customizable limit

    this.calorieCount.datum({'cals': cals});

    this.calorieCount.transition()
      .delay(150)
      .duration(750)
      .tween('text', function(d) {
        var i = d3.interpolate(0, d.cals);

        return function(t) {
          this.textContent = Math.round(i(t));
        }

      });

  },

  'toggleChartsMode': function() {
    var visible = this.model.get('visible')
    this.$el.toggleClass('charts-open', visible);
    this.updateArc();
    if (visible) {
      this.updateGraph(this.model.get('period'));
    }
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
  },

  'initializeGraph': function() {
    var that = this;
    var containerHeight = this.$graphContainer.height();
    var containerWidth = this.$graphContainer.width();

    var mUnit = containerWidth / 100;
    var margin = {'top': 50, 'right': 20, 'bottom': 50, 'left': 50};
    this.graphWidth = containerWidth - margin.left - margin.right,
    this.graphHeight = containerHeight - margin.top - margin.bottom;

    this.dateFormat = d3.time.format('%a %b %d %Y');

    this.graphScaleX = d3.time.scale()
        .range([0, that.graphWidth]);

    this.graphScaleY = d3.scale.linear()
        .range([that.graphHeight, 0]);

    this.graphLine = d3.svg.line()
      .x(function(d) { for (var k in d) { return that.graphScaleX(that.dateFormat.parse(k)); } })
      .y(function(d) { for (var k in d) { return that.graphScaleY(d[k]);} });

    var existingGraph = d3.select('.calorie-graph-container svg');
    if (existingGraph) {
      existingGraph.remove();
    }

    this.graphSVG = d3.select('.calorie-graph-container')
      .insert('svg', '.period-buttons-container')
      .attr('width', that.graphWidth + margin.left + margin.right)
      .attr('height', that.graphHeight + margin.top + margin.bottom - 25)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  },

  'updateGraph': function() {
    var that = this;
    var period = this.model.get('period');

    var data = this.harvestData(period);

    this.graphScaleX.domain(d3.extent(data.map(function(d) { for (var k in d) { return that.dateFormat.parse(k); } })));

    this.graphScaleY.domain(d3.extent(data.map(function(d) { for (var k in d) { return d[k];} })));

    this.graphXAxis = d3.svg.axis()
        .scale(that.graphScaleX)
        .orient('bottom')
        .ticks(that.xTicks)
        .tickFormat(that.labelFormat);

    this.graphYAxis = d3.svg.axis()
        .scale(that.graphScaleY)
        .orient('left');


    var $path = this.$graphContainer.find('path');

    if ($path) {
      d3.select('.calorie-graph-container .line').remove();
      d3.select('.calorie-graph-container .graph-y-axis').remove();
      d3.select('.calorie-graph-container .graph-x-axis').remove();
    }

    this.graphSVG.append('g')
      .attr('class', 'graph-x-axis axis')
      .attr('transform', 'translate(0,' + that.graphHeight + ')')
      .style('fill', '#f0f0f0')
      .call(that.graphXAxis);

    this.graphSVG.append('g')
      .attr('class', 'graph-y-axis axis')
      .style('fill', '#f0f0f0')
      .call(that.graphYAxis)
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '0.71em')
      .style('fill', '#f0f0f0')
      .style('text-anchor', 'end')
      .text('Cals');

    this.graphSVG.append('path')
      .attr('class', 'line')
      .attr('d', that.graphLine(data[0]))
      .transition()
      .duration(1250)
      .attrTween('d', that.lineGraphTween(data, that));

  },

  'harvestData': function(period) {
    var existingDateObjects = this.getDates();
    var existingDates = [];

    for (var date in existingDateObjects) {
      existingDates.push(date);
    }

    var dates = [];
    var dateString, i, currentDate, obj;

    if (app.date) {
      currentDate = app.date.get('date')
    } else { ( currentDate = new Date()).toDateString(); }

    var rangeDate = new Date(currentDate);
    var now = new Date(currentDate);
    var endDate = new Date(currentDate);

    switch(period) {
      case 'weekly':
        this.xTicks = 7;
        this.labelFormat = d3.time.format('%a %e');
        rangeDate.setDate(rangeDate.getDate() - 3);
        endDate.setDate(endDate.getDate() + 3);
        break;
      case 'monthly':
        this.xTicks = 5;
        this.labelFormat = d3.time.format('%a %e');
        rangeDate.setDate(rangeDate.getDate() - 31);
        break;
      case 'yearly':
        this.xTicks = 12;
        this.labelFormat = d3.time.format('%b');
        rangeDate.setDate(rangeDate.getDate() - 365);
        break;
    }

    for (var d = rangeDate; d <= endDate; d.setDate(d.getDate() + 1)) {
      obj = {};
      dateString = d.toDateString();
      i = existingDates.indexOf(dateString);
      if (i > -1) {
        for (var date in existingDateObjects) {
          if (date === existingDates[i]) {
            obj[dateString] = existingDateObjects[date];
            dates.push(obj);
          }
        }
      } else {
        obj[dateString] = 0;
        dates.push(obj);
      }
    }

    return dates;

  },

  'getDates': function() {
    var existingDates = {};
    var date, cals;
    app.dates.each(function(model) {
      date = model.get('date');
      cals = model.get('calories');
      existingDates[date] = cals;
    });
    return existingDates;
  },

  'lineGraphTween': function(data, that) {

    return function(d, i, a) {

      var interpolate = d3.scale.linear()
        .domain([0, 1])
        .range([1, data.length + 1]);

      return function(t) {

        var flooredX = Math.floor(interpolate(t));
        var weight = interpolate(t) - flooredX;
        var interpolatedLine = data.slice(0, flooredX);

        return that.graphLine(interpolatedLine);

      }

    }

  },

  'changeGraphPeriod': function(e) {
    var target = e.target;
    var period = target.classList[1];

    this.model.set({
      'period': period
    });

    this.highlightSelectedPeriod();

  },

  'highlightSelectedPeriod': function() {
    var that = this;
    $('.period-toggle').each(function(i) {
      $(this).toggleClass('period-selected', $(this).hasClass(that.model.get('period')));
    });
  },

  'resize': function() {
    this.initializeGraph();
    this.updateGraph('weekly');
  }

});