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
    res.send(dibujar());
});

module.exports = app;

//-----------------------maze------------------
Math.nextInt = function (number) {
    return Math.floor(Math.random() * number)
}

function println(string){
    console.log(string);
}

var Constants ={
    WALL_ABOVE : 1,
    WALL_BELOW : 2,
    WALL_LEFT : 4,
    WALL_RIGHT : 8,
    QUEUED : 16,
    IN_MAZE : 32
}


function Maze(width, height, cell_width) {
  var numeroRandom = Math.floor((Math.random() * 35) + 30);
      this.width = numeroRandom;
      this.height = numeroRandom;
      this.cell_width = 15;
    this.maze = []

    this.createMaze = function()  {
        var width = this.width
        var height = this.height
        let maze = this.maze

        var dx = [ 0, 0, -1, 1 ];
        var dy = [ -1, 1, 0, 0 ];

        let todo = new Array(height * width);
        let x, y, n, d;
        var  todonum;

         Wall_NoBrick(maze,0,this.height,this.width);

        x = 1 + Math.nextInt(width - 2);
        y = 1 + Math.nextInt(height - 2);

        maze[x][y] &= ~48;


        rodearCuadros(maze,todo,dx,dy,x,y,0,0);
        d=gD;
        todonum=gTodos;
        console.log("arriba"+todonum);


        while (todonum > 0) {
            /* We select one of the squares next to the maze. */
            n = Math.nextInt(todonum);
            x = todo[n] >> 16; /* the top 2 bytes of the data */
            y = todo[n] & 65535; /* the bottom 2 bytes of the data */

            /* We will connect it, so remove it from the queue. */
            todo[n] = todo[--todonum];

            /* Select a direction, which leads to the maze. */
            do {
                d = Math.nextInt(4);
            }
            while ((maze[x + dx[d]][y + dy[d]] & Constants.IN_MAZE) != 0);

            /* Connect this square to the maze. */
            maze[x][y] &= ~((1 << d) | Constants.IN_MAZE);
            maze[x + dx[d]][y + dy[d]] &= ~(1 << (d ^ 1));

            /* Remember the surrounding squares, which aren't */
            for (d = 0; d < 4; ++d) {
                if ((maze[x + dx[d]][y + dy[d]] & Constants.QUEUED) != 0) {
                    todo[todonum++] = ((x + dx[d]) << Constants.QUEUED) | (y + dy[d]);
                    maze[x + dx[d]][y + dy[d]] &= ~Constants.QUEUED;

                }
            }
            /* Repeat until finished. */
        }

        /* Add an entrance and exit. */
        maze[1][1] &= ~Constants.WALL_ABOVE;
        maze[width - 2][height - 2] &= ~Constants.WALL_BELOW;
    }
    /* Called to write the maze to an SVG file. */
    this.printSVG = function () {
        console.log("printSVG");
        var outstring = this.drawMaze();
        return outstring;
    }

    this.drawMaze = function () {
        var x, y;
        var width = this.width;
        var height = this.height;
        var cell_width = this.cell_width
        var outstring = new Array();
        for (x = 1; x < width - 1; ++x) {
            for (y = 1; y < height - 1; ++y) {
                if ((this.maze[x][y] & Constants.WALL_ABOVE) != 0)
                    outstring.push(this.drawLine(      x * cell_width,       y * cell_width,      (x + 1) * cell_width,       y * cell_width));
                if ((this.maze[x][y] & Constants.WALL_BELOW) != 0)
                    outstring.push(this.drawLine(      x * cell_width, (y + 1) * cell_width,      (x + 1) * cell_width, (y + 1) * cell_width));
                if ((this.maze[x][y] & Constants.WALL_LEFT) != 0)
                    outstring.push(this.drawLine(      x * cell_width,       y * cell_width,      x * cell_width, (y + 1) * cell_width));
                if ((this.maze[x][y] & Constants.WALL_RIGHT) != 0)
                    outstring.push(this.drawLine((x + 1) * cell_width,       y * cell_width,      (x + 1) * cell_width, (y + 1) * cell_width));
            }
        }
        return outstring;
    }

    this.drawLine = function (x1, y1, x2, y2) {
        return {x1:x1,x2:x2,y1:y1,y2:y2};
        }
    }

let gD,gTodos;
function rodearCuadros(a,t,xd,yd,x,y,num,tn){
    (num < 4) ? ejecucion() : (gD = num, gTodos = tn);
    function ejecucion(){
    if ((a[x + xd[num]][y + yd[num]] & Constants.QUEUED) != 0) {
                t[tn] = ((x + xd[num]) << Constants.QUEUED) | (y + yd[num]);
                a[x + xd[num]][y + yd[num]] &= ~Constants.QUEUED;
            }
            rodearCuadros(a,t,xd,yd,x,y,num+1,tn+1);
    }
}

function Wall_NoBrick(a,x,height,width){
                a[x] = [];
                if(x < height) Wall_Brick(0);
                function Wall_Brick(y){
                    (x == 0 || x == width - 1 || y == 0 || y == height - 1) ? a[x][y] = Constants.IN_MAZE :a[x][y] = 63;
                    (y < width) ? Wall_Brick(y+1) : Wall_NoBrick(a,x+1,height,width);
            }
        }

function dibujar() {
    var m = new Maze();
    m.createMaze();
    return m.printSVG();
}
