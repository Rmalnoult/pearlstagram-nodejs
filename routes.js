var home = require ('./controller/home');

function routes (app) {
	app.get('/', home.getIndex);
	app.get('/suscribing', home.instagramSuscriptionHandshake);
	app.post('/suscribing', home.onNewPic);
};

module.exports = routes;