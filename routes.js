var home = require ('./controller/home');

function routes (app) {
	app.get('/', home.getIndex);
	app.get('/newinstagrampic', home.displayNewPic);
	app.get('/suscribing', home.getInstagramToken);
};

module.exports = routes;