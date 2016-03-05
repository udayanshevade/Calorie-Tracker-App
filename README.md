# Calorie Tracker Project

#### Keep track of calories and find recipes

**Search** for various foods by name or brand and add them to the list of daily foods consumed, or manually add your own custom food. The app will keep track of the calories you've eaten and provide visualizations of trends over different periods of time. Search for recipes as well. See more information on each particular food or recipe.


## Live Site:

[Check it out](http://udayanshevade.github.io/Calorie-Tracker-App/)!

## Installation:

1. Download repository.
2. Install dependencies as specified in package.json: `npm install`
3. If you make changes to the js or css files, run the build process: `grunt` and `grunt html`
4. Navigate to the dist/ folder.
5. Host a simple server: `python -m SimpleHTTPServer 8000`
7. Open http://localhost:8000/ in your browser and enjoy!

## In-app Instructions:

1. Click on the search input to expand search mode.
2. Find foods by brands or names.
3. Click on a food result for details or quick add the item.
4. Or add specific amounts via the nutrition details view.
5. Also see charts regarding calorie consumption over time.
6. You can also search for recipes and read details on them.
7. Data persists via browser storage so navigate to any date and add/remove foods.

### 3rd Party APIs:

1. Nutritionix: https://developer.nutritionix.com/docs/v1_1
2. Yummly: https://developer.yummly.com/documentation

### Plugins:

1. Pikaday calendar: https://github.com/dbushell/Pikaday
2. Radar chart: https://github.com/alangrafu/radar-chart-d3


## References:

- Nutritionix API documentation
- Yummly API documentation
- Backbone documentation
- Underscore documentation
- Pikaday plugin documentation
- d3 documentation and examples
- [Morphing Search from Codrops](http://tympanus.net/codrops/?p=21106)

## Future Features:

1. Add custom daily calorie limit
2. Add firebase persistence instead of local storage
3. Add goals

## Contact:

udayan.shevade@gmail.com