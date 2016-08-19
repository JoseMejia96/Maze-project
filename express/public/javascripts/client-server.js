//-------------AJAX---------------------------------------
function Laberinto() {
    var data = {};
    $.ajax({
        type: 'POST',
        contentType: 'application/json',
        url: 'http://localhost:3000/generaMaze',
        success: function (data) {
            maze = jsonMaze(JSON.parse(data));
            draw();
            console.log('success');
        }
    });
}
//---------------------------------------------------------------
function enviaDatos(x, y) {
    var data = { x: x, y: y };
    $.ajax({
        type: 'POST',
        data: data,
        ontentType: 'application/json',
        url: 'http://localhost:3000/insert',
        success: function (data) {
            console.log(data.done);
        }
    });
}
//-----------------------------------------------------------------
var canvas;
var maze = [];
window.onload = function () {
    Laberinto();
    canvas = $('#Maze');
    document.onkeydown = press;
}

function jsonMaze(data) {
    var mazeTemp = [];
    data.forEach(x => mazeTemp.push(x.linea));
    return mazeTemp;
}

var player = {
    x: 1,
    y: 0
};

function fillAll(blockSize, ctx) {
    function fillIt(y, x) {
        if (x < maze[y].length) {
            (maze[y][x] === 1) ? (ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize)) : (
                (maze[y][x] === -1) ? (
                    ctx.beginPath(),
                    ctx.lineWidth = 5,
                    ctx.strokeStyle = "gold",
                    ctx.moveTo(x * blockSize, y * blockSize),
                    ctx.lineTo((x + 1) * blockSize, (y + 1) * blockSize),
                    ctx.moveTo(x * blockSize, (y + 1) * blockSize),
                    ctx.lineTo((x + 1) * blockSize, y * blockSize),
                    ctx.stroke()) : 0);
            fillIt(y, x + 1);
        } else if (y < maze.length - 1) {
            fillIt(y + 1, 0);
        }
    }
    fillIt(0, 0);
}

//---------------------------Primera vez-----------------------
function draw() {
    var width = canvas.width();
    var blockSize = width / ((maze.length) + 20);
    var ctx = canvas[0].getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, width, width);
    ctx.fillStyle = "black";
    //Loop through the maze array drawing the walls and the goal
    fillAll(blockSize, ctx);
    //Draw the player
    ctx.beginPath();
    var half = blockSize / 2;
    ctx.fillStyle = "red";
    ctx.arc(player.x * blockSize + half, player.y * blockSize + half, half, 0, 2 * Math.PI);
    ctx.fill();
}

//Check to see if the new space is inside the maze and not a wall
function canMove(x, y) {
    return (y >= 0) && (y < maze.length) && (x >= 0) && (x < maze[y].length) && (maze[y][x] != 1);
}


function press(e) {
    if ((e.which == 38) && canMove(player.x, player.y - 1))//Up arrow
        player.y--;
    else if ((e.which == 40) && canMove(player.x, player.y + 1)) // down arrow
        player.y++;
    else if ((e.which == 37) && canMove(player.x - 1, player.y))
        player.x--;
    else if ((e.which == 39) && canMove(player.x + 1, player.y))
        player.x++;

    enviaDatos(player.x, player.y);
    draw();
    e.preventDefault();
}
//---------------------------------------------------------------------------
function searchMaze(y, x) {
    var r = "";
    function searchMaze(y, x, m) {
        if (r.indexOf("," + x + "" + y) == -1) {
            r += "," + x + "" + y;
            var log1 = (x < 0) || (x > 80) || (y < 0) || (y > 59);
            if (log1 == false) {
                var log2 = m[y][x] == 1 || m[y][x] == 2;
                if (log2 == false) {
                    
                    var copy = m.map((arr) => arr.slice());
                    copy[y][x] = 2;  // estoy bien
                    player.y=y;
                    player.x=x;
                    draw();
                    if ((x == 80) && (y == 59)) {
                        console.log("Yuhu!, i have found the way out!");
                        return copy;
                    }
                    
                    var d = searchMaze(y, (x + 1), copy);   // der

                    if (d != undefined) {
                        return d;
                    }

                    var a = searchMaze(y + 1, x, copy);   // abajo


                    if (a != undefined) {
                        return a;
                    }
                    var i = searchMaze(y, x - 1, copy);   // izq


                    if (i != undefined) {
                        return i;
                    }
                    if (y > 0)
                        var u = searchMaze(y - 1, x, copy);   // arriba


                    if (u != undefined) {
                        return u;
                    }
                }
            }
        }
    }
    return searchMaze(y, x, maze);
}
//--------------------------------------------------RESPUESTA MARCADA-------------------------------------------------------------
function fillAllAnswer(blockSize, ctx) {
    function fillItAnswer(y, x) {
        if (x < maze[y].length) {
            switch (maze[y][x]) {
                case 0:
                    ctx.fillStyle = "white";
                    break;
                case 1:
                    ctx.fillStyle = "black";
                    break;
                case 2:
                    ctx.fillStyle = "red";
                    break;
            }
            ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
            fillItAnswer(y, x + 1);
        } else if (y < maze.length - 1) {
            fillItAnswer(y + 1, 0);
        }
    }
    fillItAnswer(0, 0);
}

function drawAnswer() {
    maze = searchMaze(0, 1);
    console.log(JSON.stringify(maze));
    var width = canvas.width();
    var blockSize = width / ((maze.length) + 20);
    var ctx = canvas[0].getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, width, width);
    //Loop through the maze array drawing the walls and the goal
    fillAllAnswer(blockSize, ctx);
}
