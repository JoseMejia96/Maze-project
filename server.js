var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var morgan = require('morgan');

app.use(morgan('dev'));//nada but logs

// configuracion body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3000;

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/MazeDB');
var Maze = require('./modelo/model');
var generate = require('./Control/generateMaze');

var router = express.Router();


app.use('/index.html',express.static('public'));
app.use('/index.html',express.static('views'));


let RangeArray = (a, b) => Array.from({ length: a }, (v, j) => b(j));


router.route("/generaMaze").post(function (req, res) {
	let s = req.body.size;
    res.send(JSON.stringify(generate.Dibuja(s)));
});

router.route('/BorraData').post(function (req, res) {
	Maze.remove({}, function (err) {
		if (err) {
			console.log(err)
		} else {
			res.end('success');
		}
	}
    );
	});

router.route('/MazeDB').post(function (req, res) {
	Maze.remove({}, function (err) {
		if (err) {
			console.log(err)
		} else {
			res.end('success');
		}
	}
    );
	var maze = new Maze();
	maze.x = req.body.x;
	maze.y = req.body.y;
	maze.maze =JSON.stringify(req.body.mmmaze);
	maze.save(function (err) {
		if (err)
			console.log(err);
	});
});

router.route('/ObtenerDatos')
	.post(function (req, res) {
		Maze.find(function (err, maze) {
			if (err)
				res.send(err);
			res.json(maze);
		});
	});

// Registar rutas -------------------------------
app.use('/index.html/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic starts on port ' + port);
