console.log('hello world !');
var express = require('express');
var app = express();
var expressLayouts = require('express-ejs-layouts');
var session = require('express-session');
var bodyParser = require('body-parser');
// require('./lib/twitter');

// définit des sessions
app.use(session({
	secret: 'ma super key super secrete',
}));

// config du body parser
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());


// definit qu'on utilise ejs pour les fichier en .html
app.engine('html', require('ejs').__express);
// on lui dit de l'utiliser maintenant
app.set('view engine', 'html');
// on lui dit où le trouver
app.set('views', __dirname + '/views');
app.set('layout', 'layout');
// pour faire marcher ejs
app.use(expressLayouts);

// on stocke la route et on l'utilise dans express
var routes = require('./routes');
routes(app);

// pour express : il faut utiliser un port
var server = app.listen(8080);
//socket.io écoute le port 8080
var io = require('socket.io').listen(server);
require('./lib/socket')(io);
// définit public comme dossier par défaut pour le navigateur quand on met un '/' au début de l'url
app.use("/", express.static(__dirname + '/public'));


