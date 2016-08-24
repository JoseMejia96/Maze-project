var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var morgan     = require('morgan');

app.use(morgan('dev'));

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port     = process.env.PORT || 3000;

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/MazeDB');
var Maze = require('./modelo/model');


var router = express.Router();


router.use(function(req, res, next) {
	// do logging
	console.log('Something is happening.');
	next();
});

app.use(express.static('public'));
app.use(express.static('views'));
router.get('/', function(req, res) {
});


// ----------------------------------------------------
app.post("/generaMaze",function (req, res) {
    res.send(JSON.stringify(DrawMaze()));
});

router.route('/MazeDB')
.post(function(req, res) {
	console.log(req.body);
		var maze = new Maze();
		maze.x = req.body.x;
		maze.y = req.body.y;
		maze.save(function(err){
			if(err)
				console.log(err);
			});
		})

		.get(function(req, res) {
			Maze.find(function(err, maze) {
				if (err)
					res.send(err);

				res.json(maze);
			});
		});

//-----------------------maze------------------
function maze(x, y) {
	var n = x * y - 1;
	if (n < 0) { alert("illegal maze dimensions"); return; }
	var horiz = []; for (var j = 0; j < x + 1; j++) horiz[j] = [],
		verti = []; for (var j = 0; j < x + 1; j++) verti[j] = [],
			here = [Math.floor(Math.random() * x), Math.floor(Math.random() * y)],
			path = [here],
			unvisited = [];
	for (var j = 0; j < x + 2; j++) {
		unvisited[j] = [];
		for (var k = 0; k < y + 1; k++)
			unvisited[j].push(j > 0 && j < x + 1 && k > 0 && (j != here[0] + 1 || k != here[1] + 1));
	}
	while (0 < n) {
		var potential = [[here[0] + 1, here[1]], [here[0], here[1] + 1],
			[here[0] - 1, here[1]], [here[0], here[1] - 1]];
		var neighbors = [];
		for (var j = 0; j < 4; j++)
			if (unvisited[potential[j][0] + 1][potential[j][1] + 1])
				neighbors.push(potential[j]);
		if (neighbors.length) {
			n = n - 1;
			next = neighbors[Math.floor(Math.random() * neighbors.length)];
			unvisited[next[0] + 1][next[1] + 1] = false;
			if (next[0] == here[0])
				horiz[next[0]][(next[1] + here[1] - 1) / 2] = true;
			else
				verti[(next[0] + here[0] - 1) / 2][next[1]] = true;
			path.push(here = next);
		} else
			here = path.pop();
	}
	return { x: x, y: y, horiz: horiz, verti: verti };
}

function GenerateMaze(m){
function mmaze(j,k,outstring,line,m){
if(j<m.x*2+1){
  if(k<m.y*2+1){
    if(j%2==0)
    (0==k%2)?line[k]=1:((j>0&&m.verti[j/2-1][Math.floor(k/2)])?line[k]=0:line[k]=1);
    else
    (0==k%2)?((k>0&&m.horiz[(j-1)/2][k/2-1])?line[k]=0:line[k]=1):line[k]=0;
    mmaze(j,k+1,outstring,line,m);
  }else{
    (0==j)?line[1]=0:0;
    (m.x*2-1==j)?line[2*m.y]=-1:0;
    outstring.push(saveLine(line));
    mmaze(j+1,0,outstring,[],m);
  }
  }
  return outstring;
}
  return mmaze(0,0,[],[],m);
}

function saveLine(line) {
	return { linea: line };
}

function DrawMaze() {
	console.log("Dibujando!!")
	return GenerateMaze(maze(30, 40));
}


// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);

module.exports = app;
