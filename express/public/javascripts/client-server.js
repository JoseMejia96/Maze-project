var canvas;
var maze = [];
window.onload = function(){
	Laberinto();
	canvas = $('#Maze');
	document.onkeydown = press;
}

function Laberinto(){
var data = {};
	data.title = "title";
	data.message = "message";

		$.ajax({
			type: 'POST',
	        contentType: 'application/json',
	        url: 'http://localhost:3000',
	        success: function(data) {
	        	maze = jsonMaze(data);
						draw();
	          console.log('success');
	        }
	    });
}

function jsonMaze(data){
	var mazeTemp= [];
	data.forEach(x=>mazeTemp.push(x.linea));
	return mazeTemp;
}

var player = {
    x: 1,
    y: 0
};

//Draw the game maze
function draw(){
	console.log("entra");
    var width = canvas.width();
    var blockSize = width/((maze.length)+20);
    var ctx = canvas[0].getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, width, width);
    ctx.fillStyle="black";
    //Loop through the maze array drawing the walls and the goal
    for(var y = 0; y < maze.length; y++){
        for(var x = 0; x < maze[y].length; x++){
            //Draw a wall
            if(maze[y][x] === 1){
                ctx.fillRect(x*blockSize, y*blockSize, blockSize, blockSize);
            }
            //Draw the goal
            else if(maze[y][x] === -1){
                ctx.beginPath();
                ctx.lineWidth = 5;
                ctx.strokeStyle = "gold";
                ctx.moveTo(x*blockSize, y*blockSize);
                ctx.lineTo((x+1)*blockSize, (y+1)*blockSize);
                ctx.moveTo(x*blockSize, (y+1)*blockSize);
                ctx.lineTo((x+1)*blockSize, y*blockSize);
                ctx.stroke();
            }
        }
    }
    //Draw the player
    ctx.beginPath();
    var half = blockSize/2;
    ctx.fillStyle = "red";
    ctx.arc(player.x*blockSize+half, player.y*blockSize+half, half, 0, 2*Math.PI);
    ctx.fill();
}

//Check to see if the new space is inside the maze and not a wall
function canMove(x, y){
    return (y>=0) && (y<maze.length) && (x >= 0) && (x < maze[y].length) && (maze[y][x] != 1);
}


function press(e){
    if((e.which == 38) && canMove(player.x, player.y-1))//Up arrow
        player.y--;
    else if((e.which == 40) && canMove(player.x, player.y+1)) // down arrow
        player.y++;
    else if((e.which == 37) && canMove(player.x-1, player.y))
        player.x--;
    else if((e.which == 39) && canMove(player.x+1, player.y))
        player.x++;
    draw();
    e.preventDefault();
}

//
