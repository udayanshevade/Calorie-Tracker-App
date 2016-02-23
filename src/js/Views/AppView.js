
var app = app || {};

app.AppView = Backbone.View.extend({

  'el': $('main'),

  'events': {
    'click #count-container': 'toggleCalorieMode',
    'click .foods-expand-toggle': 'expandFoods',
    'click .clear-foods': 'clearFoods',
    'click .manual-toggle': 'openManualAdd',
    'click .charts-toggle': 'openCharts',
    'change #header-date': 'changeDate',
  },

  'initialize': function() {

    app.calorieCount = new app.CalorieCount();

    app.inputView = new app.InputView({
      'model': app.input
    });

    app.manualInputView = new app.ManualInputView({
      'model': app.manualInput
    });

    app.calorieCountView = new app.CalorieCountView({
      'model': app.calorieCount
    });

    this.$calories = this.$el.find('#count');
    this.$user = this.$el.find('#user');
    this.$date = this.$el.find('#header-date');
    this.$mainFoods = this.$el.find('#main-foods-container');
    this.$mainFoodsTitle = this.$el.find('.main-foods-title');
    this.$mainFoodsList = this.$el.find('.main-foods-list');

    this.nutritionixAPI = {
      'base': 'https://api.nutritionix.com/v1_1/',
      'id': '419ba5cc',
      'key': 'd84b29e2533c00844b6d2ceccba5cf46',
      'suffix': '?results=0:20&fields=item_name,brand_name,item_id,nf_calories&appId=419ba5cc&appKey=d84b29e2533c00844b6d2ceccba5cf46'
    };

    this.listenTo(app.dates, 'reset', this.changeDate);
    this.listenTo(app.dates, 'add', this.newDate);

    this.listenTo(app.foods, 'add', this.addFood);
    this.listenTo(app.foods, 'reset', this.addAll);
    this.listenTo(app.foods, 'update', this.updateFoods);

    app.chartsView = new app.ChartsView({
      'model': app.charts
    });

    app.chartsView.initializeGraph();

    app.dates.fetch({'reset': true});

    this.$datePicker = this.$date.pikaday({
      'firstDay': 1,
      'minDate': new Date(2000, 0, 1),
      'maxDate': new Date()
    });

    this.render();

  },

  'render': function() {

    app.dateView.render();

    this.checkListLength();

    this.$calories.append(app.calorieCountView.render().el);

    app.calorieCount.updateCalories();

    return this;
  },

  'updateFoods': function() {
    this.checkListLength();
    app.calorieCount.updateCalories();
    this.updateDate();
    app.chartsView.updateArc();
    app.chartsView.updateGraph('weekly');
  },

  'checkListLength': function() {
    this.$mainFoods.toggleClass('foods-populated', (app.foods.length > 0));
  },

  'addFood': function(food) {
    app.foods.addFood(food);
    app.calorieCount.updateCalories();
  },

  'addAll': function() {
    var that = this;
    app.foods.each(function(food) {
      that.addFood(food);
    });
    this.updateFoods();
  },

  'updateDate': function() {
    app.date.updateCalories();
    app.date.updateFoods();
  },

  'toggleCalorieMode': function() {
    app.calorieCount.toggleMode();
    this.$el.find('.count-mode-icon').toggleClass('flipped', app.calorieCount.get('countUp'));
  },

  'expandFoods': function() {
    this.$mainFoods.toggleClass('foods-expanded');
  },

  'clearFoods': function() {
    app.foods.clearFoods();
  },

  'openManualAdd': function() {
    app.manualInput.openManualMode();
  },

  'openCharts': function() {
    app.charts.open();
  },

  'switchDateData': function(date) {
    app.date = date;
    app.foods.clearFoodViews();
    app.foods.reset(date.get('foods'));
    this.removeAllEmptyDates();
  },

  'changeDate': function() {
    var newDate;
    var val = this.$date.val() || new Date().toDateString();
    var matchedModel = app.dates.find(function(model) {
      return model.get('date') === val;
    });

    if (app.dateView) {
      app.dateView.empty();
    }

    if (matchedModel) {

      this.switchDateData(matchedModel);

      app.dateView = new app.DateView({
        'model': app.date
      });

    } else {

      app.date = new app.Date({
        'date': val
      });

      app.dates.create(app.date);

      app.dateView = new app.DateView({
        'model': app.date
      });

    }

    if (app.charts.get('visible')) {
      app.chartsView.updateArc();
    }

  },

  'removeModel': function(model) {
    model.destroy();
  },

  'removeAllEmptyDates': function() {
    var that = this;
    var modelDate, modelFoods;
    var date = new Date().toDateString();
    app.dates.each(function(model) {
      if (model) {
        modelDate = model.get('date');
        modelFoods = model.get('foods');
        if (modelDate !== date
          && modelDate !== app.date.get('date')
          && (!modelFoods || !modelFoods.length)) {
          that.removeModel(model);
        }
      }
    });
  },

  'newDate': function() {
    this.removeAllEmptyDates();
    app.foods.clearFoodViews();
    app.foods.reset(app.date.get('foods'));
  }


});