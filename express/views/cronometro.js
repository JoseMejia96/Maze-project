
var inicio = 0;
var timeout = 0;
inicio = vuelta = new Date().getTime();

function funcionando() {
    var actual = new Date().getTime();
    var diff = new Date(actual - inicio);
    var result = LeadingZero(diff.getUTCHours()) + ":" + LeadingZero(diff.getUTCMinutes()) + ":" + LeadingZero(diff.getUTCSeconds());
    postMessage(result);
    timeout = setTimeout("funcionando()", 1001);
}

/* Funcion que pone un 0 delante de un valor si es necesario */
function LeadingZero(Time) {
    return (Time < 10) ? "0" + Time : + Time;
}

funcionando();
