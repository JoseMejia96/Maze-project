var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var morgan = require('morgan');
var port = process.env.PORT || 3000;
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/MazeDB');
mongoose.Promise = require('bluebird');
var Maze = require('./modelo/model');
var generate = require('./Control/generateMaze');
var router = express.Router();

app.use(morgan('dev'));//nada but logs

// configuracion body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/index.html',express.static('public'));
app.use('/index.html',express.static('views'));

router.route("/generaMaze").post( (req, res)=> {
    res.send(JSON.stringify(generate.drawMaze.Dibuja(req.body.size)));
});

//Borrar
router.route('/BorraData').post( (req, res) => {
 Maze.remove({}).exec().then(res.send({dato:"borrado"}))
 		}
	);

	//Inserta
	router.route('/MazeDB').post(function (req, res) {
		Maze.remove({}).exec().then(res.send({dato:"borrado"}))
		var maze = new Maze();
		maze.x = req.body.x;
		maze.y = req.body.y;
		maze.maze =JSON.stringify(req.body.mmmaze);
		maze.save().exec().then(res.send({dato:"Insertado"}))
 	                        .catch(err => console.log(err));
	});

	//Obtener Datos
	router.route('/ObtenerDatos').get((req,res) => Maze.find().exec()
	.then(mazes => {console.log(mazes); return mazes}).then(mazes => res.send(mazes))
	);

// Registar rutas -------------------------------
app.use('/index.html/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic starts on port ' + port);
