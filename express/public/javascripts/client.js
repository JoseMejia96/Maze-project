//-------------VARIABLES NECESARIAS------------------------

var canvas, leftRight = 1.2, upDown = -1.8;
var myAudio;
var maze = [];
var player = {
    x: 1,
    y: 0
};
//-----------------------Cronometro

//-------------FETCH---------------------------------------

let getLaberynth = (x) => fetch('http://localhost:3000/api/generaMaze', {
    method: 'POST',
    headers: { "Content-type": "application/json; charset=UTF-8" },
    body: JSON.stringify({ size: x })
    }).then(function (response) {
    return response.json()
        .then(function (json) {
            maze = jsonMaze(json);
            draw();
            console.log('Maze is done!!');
        });
}).catch(function (error) {
    console.log('Request failed', error);
});

let enviaDatos = (x, y) => fetch('http://localhost:3000/api/MazeDB', {
    method: 'POST',
    headers: { "Content-type": "application/json; charset=UTF-8" },
    body: JSON.stringify({ x: x, y: y })
}).catch(function (error) {
    console.log('Request failed', error);
});

//----------------------Audio fondo-----------------
function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function () {
        this.sound.play();
    }
    this.stop = function () {
        this.sound.pause();
    }
}

function soundTrack(src) {
    myAudio = new Audio(src);
    myAudio.addEventListener('ended', function () {
        this.currentTime = 0;
        this.play();
    }, false);
    myAudio.play();
}
//---------------------------ON LOAD--------------------------------------

window.onload = function () {
    soundTrack('/sound/back.mp3');
    document.onkeydown = press;

}

let Begin = () => (canvas = $('#Maze'), tiempo(),
document.getElementById("dificultades").style.display = "none",
document.getElementById("wholePage").style.display = "block"
);

let Inicio = (a) => (a == 1) ? (Begin(),getLaberynth(1)) : (
  (a == 2) ? (Begin(),getLaberynth(2)) : (
    (a == 3) ? (Begin(),getLaberynth(3)) : 0 )
);


//-----------CHIFRIJO----------------------------------------------

function jsonMaze(data) {
    var mazeTemp = [];
    data.forEach(x => mazeTemp.push(x.linea));
    return mazeTemp;
}
//--------------------------

function fillAll(blockSize, ctx) {
    function fillIt(y, x) {
        if (x < maze[y].length) {
            (maze[y][x] === 1) ? (ctx.fillStyle = "black", ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize)) : (
                (maze[y][x] === -1) ? (
                    ctx.beginPath(),
                    ctx.lineWidth = 5,
                    ctx.strokeStyle = "gold",
                    ctx.moveTo(x * blockSize, y * blockSize),
                    ctx.lineTo((x + 1) * blockSize, (y + 1) * blockSize),
                    ctx.moveTo(x * blockSize, (y + 1) * blockSize),
                    ctx.lineTo((x + 1) * blockSize, y * blockSize),
                    ctx.stroke()) : (maze[y][x] === 5) ?
                        (ctx.fillStyle = "yellow",
                            ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize)) : 0
            );
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
    var half;
    var blockSize = width / ((maze.length) + 20);
    var ctx = canvas[0].getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, width, width);
    ctx.fillStyle = "black";
    fillAll(blockSize, ctx);
    ctx.beginPath();
    half = blockSize / 2;
    ctx.fillStyle = "red";
    ctx.arc(player.x * blockSize + half, player.y * blockSize + half, half, 0, 2 * Math.PI);
    ctx.fill();
}

//------------Check if  new space is inside the maze && not a wall------------
function canMove(x, y) {
    return (y >= 0) && (y < maze.length) && (x >= 0) && (x < maze[y].length) && (maze[y][x] != 1);
}

//------TRIGGERED EVENT ON KEY DOWN------------------------------
function press(e) {
    var hit = new sound('/sound/Boing.mp3');
    var win, dab = new sound('/sound/dab.mp3'), ctx = canvas[0].getContext('2d');
    switch (e.which) {
        case 38:
            canMove(player.x, player.y - 1) ? player.y-- : hit.play();
            break;
        case 40:
            canMove(player.x, player.y + 1) ? player.y++ : hit.play();
            break;
        case 37:
            canMove(player.x - 1, player.y) ? player.x-- : hit.play();
            break;
        case 39:
            canMove(player.x + 1, player.y) ? player.x++ : hit.play();
            break;
    }
    enviaDatos(player.x, player.y);
    draw();
    e.preventDefault();
}
//--------------------Backtracking miedo find path to win-----------------------------------
function searchMaze(y, x) {
    var sol;
    var ly=maze.length-1;
    var lx=maze[1].length-1;
    function searchMaze(y, x, m) {
        if (!sol) {
            if (maze[y][x] != 5) {
                var log1 = (x < 0) || (x > lx) || (y < 0) || (y > ly);
                if (!log1) {
                    var log2 = m[y][x] == 1;
                    if (!log2) {
                        var copy = m.map((arr) => arr.slice());
                        copy[y][x] = 2;  // estoy bien
                        maze[y][x] = 5;
                        player.y = y;
                        player.x = x;
                        if ((x == lx) && (y == ly-1)) {
                            console.log("Yay!, I have found the way out!");
                            sol = copy.map((arr) => arr.slice());
                            return sol;
                        }
                        searchMaze(y + 1, x, copy);   // abajo
                        searchMaze(y, x + 1, copy);   // der
                        searchMaze(y - 1, x, copy);   // arriba
                        searchMaze(y, x - 1, copy);   // izq

                    }
                }
            }
        } else { return sol; }
    }
    searchMaze(y, x, maze);
    return sol;
}
//--------------------------------------------------Paint RESPUESTA--------------------------------------------------
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
    dab = new sound('/sound/aplauso.mp3');
    var width = canvas.width();
    var blockSize = width / ((maze.length) + 20);
    var ctx = canvas[0].getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, width, width);
    //Loop through the maze array drawing the walls and the goal
    fillAllAnswer(blockSize, ctx);
}

function drawAnswer2() {
    maze = searchMaze(player.y, player.x);
    console.log(JSON.stringify(maze));
    var width = canvas.width();
    var blockSize = width / ((maze.length) + 20);
    var ctx = canvas[0].getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, width, width);
    //Loop through the maze array drawing the walls and the goal
    fillAllAnswer(blockSize, ctx);
}



///-------CHRONO ARRACAHCE--------------------------------

var worker;
function tiempo(){
  if(typeof(worker == "undefined")){
      worker = new Worker("cronometro.js");
  }
  worker.onmessage = function(event){
  document.getElementById('crono').innerHTML = event.data;
 }
}
