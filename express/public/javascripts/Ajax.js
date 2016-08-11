$(function(){

$("#boton").click(Laberinto);
});


function Laberinto(){
document.getElementById("maze").innerHTML=""
var data = {};
	data.title = "title";
	data.message = "message";

		$.ajax({
			type: 'POST',
	        contentType: 'application/json',
	        url: 'http://localhost:3000',
	        success: function(data) {
	        	jsonMaze(data);
	            console.log('success');
	        }
	    });
}

var g;
function jsonMaze(data){
	var svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgElement.setAttribute("width",900);
    svgElement.setAttribute("height",900);
    document.getElementById("maze").appendChild(svgElement);

	g = document.createElementNS("http://www.w3.org/2000/svg", "g");
	g.setAttribute("stroke", "black");
	g.setAttribute("stroke-width", "1");
	g.setAttribute("stroke-linecap", "round");
		data.forEach(lines);
		svgElement.appendChild(g);
}

function lines(x){
	var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
		line.setAttribute("x1", x.x1);
		line.setAttribute("y1", x.y1);
		line.setAttribute("x2", x.x2);
		line.setAttribute("y2", x.y2);
		g.appendChild(line);
}

var leftRight = 0;
var topDown = 0;

window.onload =function() {
	document.onkeydown = chars;
}

function chars(evento) {
	if(window.event)
		evento = window.event;
	caracteres(evento.keyCode);
}

function caracteres(chars){
	if(chars == 68){
		leftRight += 10;
		document.getElementById("animacion").style.marginLeft = leftRight+"px";
	}

	if(chars == 65){
		leftRight -= 10;
		document.getElementById("animacion").style.marginLeft = leftRight+"px";
	}

	if(chars == 83){
		topDown += 10;
		document.getElementById("animacion").style.marginTop = topDown+"px";
	}

	if(chars == 87){
		topDown -= 10;
		document.getElementById("animacion").style.marginTop = topDown+"px";
	}
}
