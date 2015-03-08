var home = require ('./controller/home');

function routes (app) {
	app.get('/', home.getIndex);
};

module.exports = routes;