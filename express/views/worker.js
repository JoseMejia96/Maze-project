
var worker;
function tiempo() {
    if (typeof (worker == "undefined")) {
        worker = new Worker("cronometro.js");
    }
    worker.onmessage = function (event) {
        document.getElementById('crono').innerHTML = event.data;
    }
}

let startAgain = () => worker.terminate();
