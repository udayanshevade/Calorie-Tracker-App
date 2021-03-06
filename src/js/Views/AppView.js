
var app = app || {};

/*
 * Main App View
 * Controls overall behavior of app
 */
app.AppView = Backbone.View.extend({

  // selects the main DOM element for the app
  'el': $('#main'),

  // DOM events associated with the overall app
  'events': {
    'click #count-container': 'toggleCalorieMode',
    'click .foods-expand-toggle': 'expandFoods',
    'click .clear-foods': 'clearFoods',
    'click .manual-toggle': 'openManualAdd',
    'click .charts-toggle': 'openCharts',
    'change #header-date': 'changeDate',
  },

  // initialize the view object
  'initialize': function() {

    // instantiate calorie count
    app.calorieCount = new app.CalorieCount();

    // instantiate view object for main search input
    app.inputView = new app.InputView({
      'model': app.input
    });

    // instantiate view object for manual input
    app.manualInputView = new app.ManualInputView({
      'model': app.manualInput
    });

    // instantiate view object for calorie count
    app.calorieCountView = new app.CalorieCountView({
      'model': app.calorieCount
    });

    // cache reused DOM elements
    this.$calories = this.$el.find('#count');
    this.$user = this.$el.find('#user');
    this.$date = this.$el.find('#header-date');
    this.$mainFoods = this.$el.find('#main-foods-container');
    this.$mainFoodsTitle = this.$el.find('.main-foods-title');
    this.$mainFoodsList = this.$el.find('.main-foods-list');

    // nutritionix api info object
    this.nutritionixAPI = {
      'base': 'https://api.nutritionix.com/v1_1/',
      'id': '419ba5cc',
      'key': 'd84b29e2533c00844b6d2ceccba5cf46',
      'suffix': '?results=0:20&fields=item_name,brand_name,item_id,nf_calories&appId=419ba5cc&appKey=d84b29e2533c00844b6d2ceccba5cf46'
    };

    // yummly api info object
    this.yummlyAPI = {
      'base': 'http://api.yummly.com/v1/api/',
      'id': '9dd4fc11',
      'key': 'acd4fafee10e5012ab431021bdaa2dd3'
    };

    // listen to changes in app collections
    // listen to changes in persisting 'dates' collection
    this.listenTo(app.dates, 'reset', this.changeDate);
    this.listenTo(app.dates, 'add', this.newDate);
    // listen to changes in temporary foods collection
    this.listenTo(app.foods, 'add', this.addFood);
    this.listenTo(app.foods, 'reset', this.addAll);
    this.listenTo(app.foods, 'update', this.updateFoods);

    // instantiate charts view object
    app.chartsView = new app.ChartsView({
      'model': app.charts
    });

    // initialize calorie x timeline graph
    app.chartsView.initializeGraph();

    // fetch dates collection from localStorage
    app.dates.fetch({'reset': true});

    // initialize date picker plugin calendar
    this.$datePicker = this.$date.pikaday({
      'firstDay': 1,
      'minDate': new Date(2000, 0, 1),
      'maxDate': new Date()
    });

    // instantiate recipe mode view object
    app.recipeResultsView = new app.RecipeResultsView({
      'model': app.recipeInput
    });

    // render the main app
    this.render();

    $('#main').removeClass('loading');

    $(window).on('resize', function() {
      app.chartsView.resize();
    });

  },

  // overall app render function
  'render': function() {

    // render date
    app.dateView.render();
    // check length of added foods and render them appropriately
    this.checkListLength();
    // append calorie count
    this.$calories.append(app.calorieCountView.render().el);
    // update calories
    app.calorieCount.updateCalories();

    return this;
  },

  // update foods whenever the foods collection or date model changes
  'updateFoods': function() {
    this.checkListLength();
    app.calorieCount.updateCalories();
    // update the changes in the persisting models
    this.updateDate();
  },

  // check list length of added foods and alter container appropriately
  'checkListLength': function() {
    this.$mainFoods.toggleClass('foods-populated', (app.foods.length > 0));
  },

  // add food and update calories
  'addFood': function(food) {
    app.foods.addFood(food);
    app.calorieCount.updateCalories();
  },

  // batch add all food items
  'addAll': function() {
    var that = this;
    app.foods.each(function(food) {
      that.addFood(food);
    });
    this.updateFoods();
  },

  // update date model
  'updateDate': function() {
    app.date.updateCalories();
    app.date.updateFoods();
    if (app.charts.get('visible')) {
      // update the graphs
      app.chartsView.updateArc();
      app.chartsView.updateGraph('weekly');
    }
  },

  // change mode of calorie count
  'toggleCalorieMode': function() {
    app.calorieCount.toggleMode();
    this.$el.find('.count-mode-icon').toggleClass('flipped', app.calorieCount.get('countUp'));
  },

  // expand added food list
  'expandFoods': function() {
    this.$mainFoods.toggleClass('foods-expanded');
  },

  // clear added foods for the date
  'clearFoods': function() {
    app.foods.clearFoods();
  },

  // open manual mode
  'openManualAdd': function() {
    app.manualInput.openManualMode();
  },

  // open charts mode
  'openCharts': function() {
    app.charts.open();
  },

  // update app data associated with date
  'switchDateData': function(date) {
    app.date = date;
    app.foods.clearFoodViews();
    app.foods.reset(date.get('foods'));
    this.removeAllEmptyDates();
  },

  // change to new date
  'changeDate': function() {
    var newDate;
    var val = this.$date.val() || new Date().toDateString();
    var matchedModel = app.dates.find(function(model) {
      return model.get('date') === val;
    });

    if (app.dateView) {
      app.dateView.empty();
    }
    // if date already exists
    if (matchedModel) {

      // change to its data
      this.switchDateData(matchedModel);

      app.dateView = new app.DateView({
        'model': app.date
      });

    } else {
      app.date = new app.Date({
        'date': val
      });

      // or else create a new date
      app.dates.create(app.date);

      app.dateView = new app.DateView({
        'model': app.date
      });

    }

    // update graph
    if (app.charts.get('visible')) {
      app.chartsView.updateArc();
    }

  },

  // remove a specified model
  'removeModel': function(model) {
    model.destroy();
  },

  // prune all empty date objects - avoid bloating storage
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

  // new date
  'newDate': function() {
    this.removeAllEmptyDates();
    app.foods.clearFoodViews();
    app.foods.reset(app.date.get('foods'));
  }


});