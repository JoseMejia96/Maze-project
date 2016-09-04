var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var morgan = require('morgan');

app.use(morgan('dev'));

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3000;

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/MazeDB');
var Maze = require('./modelo/model');


var router = express.Router();


router.use(function (req, res, next) {
	// do logging
	console.log('Something is happening.');
	next();
});

app.use(express.static('public'));
app.use(express.static('views'));
router.get('/', function (req, res) {
});

let RangeArray = (a, b) => Array.from({ length: a }, (v, j) => b(j));


router.route("/generaMaze").post(function (req, res) {
	let s = req.body.size;
    res.send(JSON.stringify(DrawMaze(s)));
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
	console.log("x ",maze.x,",y ",maze.y,",body ",maze.maze);
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
//-----------------------maze------------------

size = [{ x: 30, y: 40 }, { x: 20, y: 30 }, { x: 10, y: 20 }];

function fillUnvisited(un, x, y) {
	function doIt(un, j, k, x, y, flag) {
		if (j < x + 2) {
			flag ? un[j] = [] : un;
			(k < y + 1) ? (
				un[j].push(j > 0 && j < x + 1 && k > 0 && (j != here[0] + 1 || k != here[1] + 1)),
				doIt(un, j, k + 1, x, y, false)
			) : (doIt(un, j + 1, 0, x, y, true));
		}
	}
	doIt(un, 0, 0, x, y, true);
}

function fillPotential(un, po, j, pos, n) {
	if (j < pos) {
		if (un[po[j][0] + 1][po[j][1] + 1])
			n.push(po[j]);
		fillPotential(un, po, j + 1, pos, n);
	}
}

function lastOne(n, unvisited, horiz, verti, path, here) {
	if (0 < n) {
		var potential = [[here[0] + 1, here[1]], [here[0], here[1] + 1], [here[0] - 1, here[1]], [here[0], here[1] - 1]];
		var neighbors = [];
		fillPotential(unvisited, potential, 0, 4, neighbors);
		(neighbors.length) ? (
			next = neighbors[Math.floor(Math.random() * neighbors.length)],
			unvisited[next[0] + 1][next[1] + 1] = false,
			(next[0] == here[0]) ?
				(horiz[next[0]][(next[1] + here[1] - 1) / 2] = true) :
				(verti[(next[0] + here[0] - 1) / 2][next[1]] = true),
			path.push(here = next),
			lastOne(n - 1, unvisited, horiz, verti, path, here)
		) : (
				here = path.pop(),
				lastOne(n, unvisited, horiz, verti, path, here)
			);
	}

}



function maze(x, y) {
	var horiz = [], verti = [];
	let fillArray1 = j => (horiz[j] = []);
	let fillArray2 = j => (verti[j] = [],
		here = [Math.floor(Math.random() * x), Math.floor(Math.random() * y)],
		path = [here],
		unvisited = []
	)
	horiz = RangeArray(x + 1, z => fillArray1(0, [], []));
	verti = RangeArray(x + 1, q => fillArray2(0));
	fillUnvisited(unvisited, x, y);
	lastOne(x * y - 1, unvisited, horiz, verti, path, here);
	return { x: x, y: y, horiz: horiz, verti: verti };
}

function GenerateMaze(m) {
	function mmaze(j, k, outstring, line, m) {
		if (j < m.x * 2 + 1) {
			if (k < m.y * 2 + 1) {
				(j % 2 == 0) ? (
					(0 == k % 2) ? line[k] = 1 : ((j > 0 && m.verti[j / 2 - 1][Math.floor(k / 2)]) ? line[k] = 0 : line[k] = 1)
				) : (
						(0 == k % 2) ? ((k > 0 && m.horiz[(j - 1) / 2][k / 2 - 1]) ? line[k] = 0 : line[k] = 1) : line[k] = 0)
				mmaze(j, k + 1, outstring, line, m);
			} else {
				(0 == j) ? line[1] = 0 : line;
				(m.x * 2 - 1 == j) ? line[2 * m.y] = 7 : line;
				outstring.push(saveLine(line));
				mmaze(j + 1, 0, outstring, [], m);
			}
		}
		return outstring;
	}
	return mmaze(0, 0, [], [], m);
}

function saveLine(line) {
	return { linea: line };
}

function DrawMaze(s) {
	console.log("Dibujando t= ", s);
	x = size[3 - s].x;
	y = size[3 - s].y;
	console.log("x= ", x, " y=", y);
	return GenerateMaze(maze(x, y));
}


// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);

module.exports = app;
