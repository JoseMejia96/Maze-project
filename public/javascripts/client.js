//-------------VARIABLES NECESARIAS------------------------

var canvas, leftRight = 1.2, upDown = -1.8;
var myAudio;
var maze = [];
var player = {
    x: 1,
    y: 0
};
var bordersize = [["800px", "600px"], ["600px", "400px"], ["400px", "200px"]];
var dbfilled = false;
var Mazelog = { lasTipo:"",lastMz: "", mazeOffline: false, playerX: "", playerY: "" };

//-------------FETCH---------------------------------------

let getLaberynth = (x) => fetch('http://localhost:3000/index.html/api/generaMaze', {
    method: 'POST',
    headers: { "Content-type": "application/json; charset=UTF-8" },
    body: JSON.stringify({ size: x })
}).then(function (response) {
    return response.json()
        .then(function (json) {
            maze = jsonMaze(json);
            draw();
            Mazelog.mazeOffline = false;
            console.log('Maze is done!!');
        });
}).catch(function (error) {
    Mazelog.mazeOffline = true;
    maze = jsonMaze(getOfflineMaze(x));
    Mazelog.lastMz = maze;
    draw();
    console.log('1) Request failed', error);
});


let enviaDatos = (x, y) => fetch('http://localhost:3000/index.html/api/MazeDB', {
    method: 'POST',
    headers: { "Content-type": "application/json; charset=UTF-8" },
    body: JSON.stringify({ x: x, y: y, maze: maze })
}).catch(function (error) {
    console.log('Request failed', error);
});

let BorraDatos = () => fetch('http://localhost:3000/index.html/api/BorraData', {
    method: 'POST',
    headers: { "Content-type": "application/json; charset=UTF-8" }
}).catch(function (error) {
    console.log('Request failed', error);
});


let getData = () => fetch('http://localhost:3000/index.html/api/ObtenerDatos', {
    method: 'GET',
    headers: { "Content-type": "application/json; charset=UTF-8" }
}).then(response => {
    return response.json()
        .then(json => {
            player.x = json[0].x;
            player.y = json[0].y;
            maze = json[0].maze;
            Mazelog.mazeOffline = false;
            dbfilled = true;
            Begin();
            fixBorder();
            draw();
            fillBarra();
        });
}).catch(function (error) {
    fillBarra();
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
//---------------------------ON LOAD----AFTER LOAD---BEFORE LOAD-------------------------------

window.onload = function () {
    let st = Mazelog.mazeOffline ? '../public/sound/back.mp3' : '/index.html/sound/back.mp3';
    soundTrack(st);
    retrieveData();
    getData();
    document.onkeydown = press;

}

let fillBarra = () => document.getElementById("infoE").value = !Mazelog.mazeOffline ? "Online" : "Offline";


function nuevola() {
    startAgain();
    document.getElementById("dificultades").style.display = "block";
    document.getElementById("wholePage").style.display = "none";
    player.x = 1;
    player.y = 0;
    BorraDatos();
}



function retrieveData() {
    var x = localStorage.getItem("Mazelog_Paradigmas_P1");
    if (x != null) {
        Mazelog = JSON.parse(x);
        if (Mazelog.mazeOffline === true) {
            if (Mazelog.lastMz != "") {
                player.x = Mazelog.playerX;
                player.y = Mazelog.playerY;
                maze = Mazelog.lastMz;
                let st = Mazelog.mazeOffline ? '../public/sound/back.mp3' : '/index.html/sound/back.mp3';
                soundTrack(st);
                Begin();
                fixBorder();
                draw();
            }
        }
    }
}

let Begin = () => (canvas = $('#Maze'), tiempo(),
    document.getElementById("dificultades").style.display = "none",
    document.getElementById("wholePage").style.display = "block"
);

let Inicio = (a) => (Begin(), Mazelog.lasTipo=a, fixBorder(a), getLaberynth(a));



//-----------CHIFRIJO----------------------------------------------

function jsonMaze(data) {
    var mazeTemp = [];
    data.forEach(x => mazeTemp.push(x.linea));
    return mazeTemp;
}

//---------------------------Art Attack-----------------------
function fixBorder() {
    x=Mazelog.lasTipo;
    var mb = document.getElementById("Maze");
    mb.setAttribute("width",bordersize[3 - x][0]);
    mb.setAttribute("height",bordersize[3 - x][1]);
    //draw();
}

function draw() {
    var width = canvas.width();
    var half;
    var blockSize = width / ((maze.length) + 20);
    var ctx = canvas[0].getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, width, width);
    ctx.fillStyle = "black";
    fillAllAnswer(blockSize, ctx);
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
    let st = Mazelog.mazeOffline ? '../public/sound/Boing.mp3' : '/index.html/sound/Boing.mp3';
    var hit = new sound(st);
    //st=Mazelog.mazeOffline?'../public/sound/dab.mp3':'sound/dab.mp3';
    let st2 = Mazelog.mazeOffline ? '../public/sound/aplauso.mp3' : '/index.html/sound/aplauso.mp3';
    var hit2 = new sound(st2);
    var win, ctx = canvas[0].getContext('2d');
    let states = {
        38: z => (canMove(player.x, player.y - 1) ? player.y-- : hit.play()),
        40: z => (canMove(player.x, player.y + 1) ? player.y++ : hit.play()),
        37: z => (canMove(player.x - 1, player.y) ? player.x-- : hit.play()),
        39: z => (canMove(player.x + 1, player.y) ? (
            (maze[player.y][player.x + 1] == 7 || maze[player.y][player.x + 1] == -1) ?
                (player.x++ , hit2.play()) : player.x++
        ) : hit.play())
    };
    states[e.which]();
    Mazelog.playerX = player.x;
    Mazelog.playerY = player.y;
    saveOffline();
    enviaDatos(player.x, player.y);
    draw();
    e.preventDefault();
}
//--------------------Backtracking miedo -----------------------------------
function searchMaze(y, x) {
    var sol;
    var ly = maze.length - 1;
    var lx = maze[1].length - 1;
    var logmmaze = maze.map((arr) => arr.slice());
    function searchMaze(y, x, m) {
        if (!sol) {
            if (logmmaze[y][x] != 5) {
                var log1 = (x < 0) || (x > lx) || (y < 0) || (y > ly);
                if (!log1) {
                    var log2 = m[y][x] == 1;
                    if (!log2) {
                        var copy = m.map((arr) => arr.slice());
                        copy[y][x] = 2;  // estoy bien
                        logmmaze[y][x] = 5;
                        if ((x == lx) && (y == ly - 1)) {
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
    let states = {
        0: "white",
        1: "black",
        2: "blue",
    };
    function fillItAnswer(y, x) {
        if (x < maze[y].length) {
            ctx.fillStyle = (states[maze[y][x]]);
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
    let st = Mazelog.mazeOffline ? '../public/sound/aplauso.mp3' : '/index.html/sound/aplauso.mp3';
    dab = new sound(st);
    dab.play();
    var width = canvas.width();
    var blockSize = width / ((maze.length) + 20);
    var ctx = canvas[0].getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, width, width);
    //Loop through the maze array drawing the walls and the goal
    fillAllAnswer(blockSize, ctx);
}



//-----------------------------Offline- a la bolognesa------------------------------

function saveOffline() {
    localStorage.setItem("Mazelog_Paradigmas_P1", JSON.stringify(Mazelog));
}

function getOfflineMaze(s) {
    size = [{ x: 30, y: 40 }, { x: 20, y: 30 }, { x: 10, y: 20 }];
    x = size[3 - s].x;
    y = size[3 - s].y;
    return GenerateMaze(mazze(x, y));

}

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

let RangeArray = (a, b) => Array.from({ length: a }, (v, j) => b(j));

function mazze(x, y) {
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
                (m.x * 2 - 1 == j) ? li[2 * m.y] = -1 : li;
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
