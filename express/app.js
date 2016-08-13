var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes');
var users = require('./routes/user');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(require('less-middleware')({ src: path.join(__dirname, 'public') }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

app.get('/', routes.index);
app.get('/users', users.list);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.post('/', function(req, res){
    res.send(DrawMaze());
});

module.exports = app;

//-----------------------maze------------------
function maze(x,y) {
	var n=x*y-1;
	if (n<0) {alert("illegal maze dimensions");return;}
	var horiz =[]; for (var j= 0; j<x+1; j++) horiz[j]= [],
	    verti =[]; for (var j= 0; j<x+1; j++) verti[j]= [],
	    here = [Math.floor(Math.random()*x), Math.floor(Math.random()*y)],
	    path = [here],
	    unvisited = [];
	for (var j = 0; j<x+2; j++) {
		unvisited[j] = [];
		for (var k= 0; k<y+1; k++)
			unvisited[j].push(j>0 && j<x+1 && k>0 && (j != here[0]+1 || k != here[1]+1));
	}
	while (0<n) {
		var potential = [[here[0]+1, here[1]], [here[0],here[1]+1],
		    [here[0]-1, here[1]], [here[0],here[1]-1]];
		var neighbors = [];
		for (var j = 0; j < 4; j++)
			if (unvisited[potential[j][0]+1][potential[j][1]+1])
				neighbors.push(potential[j]);
		if (neighbors.length) {
			n = n-1;
			next= neighbors[Math.floor(Math.random()*neighbors.length)];
			unvisited[next[0]+1][next[1]+1]= false;
			if (next[0] == here[0])
				horiz[next[0]][(next[1]+here[1]-1)/2]= true;
			else
				verti[(next[0]+here[0]-1)/2][next[1]]= true;
			path.push(here = next);
		} else
			here = path.pop();
	}
	return {x: x, y: y, horiz: horiz, verti: verti};
}

function GenerateMaze(m) {
	var outstring =[];
	for (var j= 0; j<m.x*2+1; j++) {
		var line = [];
		if (0 == j%2)
			for (var k=0; k<m.y*2+1; k++)
				if (0 == k%2){

          line[k]= 1;
        }
				else
					if (j>0 && m.verti[j/2-1][Math.floor(k/2)])
						line[k]= 0;
					else
						line[k]= 1;
		else
			for (var k=0; k<m.y*2+1; k++)
				if (0 == k%2)
					if (k>0 && m.horiz[(j-1)/2][k/2-1])
						line[k]= 0;
					else
						line[k]= 1;
				else
					line[k]= 0;
		if (0 == j) line[1]= 0;
		if (m.x*2-1 == j) line[2*m.y]= -1;
		outstring.push(saveLine(line));
	}
	return outstring;
}

function saveLine(line){
	return {linea :line};
}

function DrawMaze(){
	console.log("Dibujando!!")
		return GenerateMaze(maze(30,20));
}
