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



//-----------------------maze------------------

size = [{ x: 30, y: 40 }, { x: 20, y: 30 }, { x: 10, y: 20 }];

function fillUnvisited(un, x, y) {
	function doIt(un, j, k, x, y, flag) {
		if (j < x + 2) {
			flag ? un[j] = [] : un;
			(k < y + 1) ? (
				un[j].push(j > 0 && j < x + 1 && k > 0 && (j != act[0] + 1 || k != act[1] + 1)),
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

function lastOne(n, solas, horiz, verti, fin, act) {
	if (0 < n) {
		var po = [[act[0] + 1, act[1]], [act[0], act[1] + 1], [act[0] - 1, act[1]], [act[0], act[1] - 1]];
		var ve = [];
		fillPotential(solas, po, 0, 4, ve);
		(ve.length) ? (
			sig = ve[Math.floor(Math.random() * ve.length)],
			solas[sig[0] + 1][sig[1] + 1] = false,
			(sig[0] == act[0]) ?
				(horiz[sig[0]][(sig[1] + act[1] - 1) / 2] = true) :
				(verti[(sig[0] + act[0] - 1) / 2][sig[1]] = true),
			fin.push(act = sig),
			lastOne(n - 1, solas, horiz, verti, fin, act)
		) : (
				act = fin.pop(),
				lastOne(n, solas, horiz, verti, fin, act)
			);
	}

}



function maze(x, y) {
	var horiz = [], verti = [];
	let fillArray1 = j => (horiz[j] = []);
	let fillArray2 = j => (verti[j] = [],
		act = [Math.floor(Math.random() * x), Math.floor(Math.random() * y)],
		fin = [act],
		solas = []
	)
	horiz = RangeArray(x + 1, z => fillArray1(0, [], []));
	verti = RangeArray(x + 1, q => fillArray2(0));
	fillUnvisited(solas, x, y);
	lastOne(x * y - 1, solas, horiz, verti, fin, act);
	return { x: x, y: y, horiz: horiz, verti: verti };
}

function GenerateMaze(m) {
	function mmaze(j, k, salida, li, m) {
		if (j < m.x * 2 + 1) {
			if (k < m.y * 2 + 1) {
				(j % 2 == 0) ? (
					(0 == k % 2) ? li[k] = 1 : ((j > 0 && m.verti[j / 2 - 1][Math.floor(k / 2)]) ? li[k] = 0 : li[k] = 1)
				) : (
						(0 == k % 2) ? ((k > 0 && m.horiz[(j - 1) / 2][k / 2 - 1]) ? li[k] = 0 : li[k] = 1) : li[k] = 0)
				mmaze(j, k + 1, salida, li, m);
			} else {
				(0 == j) ? li[1] = 0 : li;
				(m.x * 2 - 1 == j) ? li[2 * m.y] = 7 : li;
				salida.push(saveLine(li));
				mmaze(j + 1, 0, salida, [], m);
			}
		}
		return salida;
	}
	return mmaze(0, 0, [], [], m);
}

function saveLine(li) {
	return { linea: li };
}

function DrawMaze(s) {
	x = size[3 - s].x;
	y = size[3 - s].y;
	return GenerateMaze(maze(x, y));
}


// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);

module.exports = app;
