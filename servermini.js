
//un exemple complet ************************************************************

http = require("http"),
    path = require("path"),
    url = require("url"),
    fs = require("fs");

var temp;
var temp_cons;
var hygroAir;
var hygroAir_cons;
var hygroSol;
var hygroSol_cons;
var lum;
var lum_cons;


function sendError(errCode, errString, response) {
    response.writeHead(errCode, { "Content-Type": "text/plain" });
    response.write(errString + "\n");
    response.end();
    return;
}

function sendFile(err, file, response) {
    if (err) return sendError(500, err, response);
    response.writeHead(200);
    response.write(file, "binary");
    response.end();
}

function getFile(exists, response, localpath) {
    if (!exists) return sendError(404, 'erreur 404 -- page inconnue ! :( ', response);
    fs.readFile(localpath, "binary",
        function (err, file) { sendFile(err, file, response); });
}

function getFilename(request, response) {
    var urlpath = url.parse(request.url).pathname; // following domain or IP and port
    if (urlpath == "/")
        urlpath = "/index.html";
    //console.log(urlpath)
    var localpath = path.join(__dirname + '/public/', urlpath); // if we are at root
    fs.exists(localpath, function (result) { getFile(result, response, localpath) });
}

var server = http.createServer(getFilename);
var io = require("socket.io").listen(server);
server.listen(80);

const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const port = new SerialPort('/dev/ttyACM0', { baudRate: 9600 });
const parser = port.pipe(new Readline({ delimiter: '\n' }));
port.on("open", () => {            // Read the port data 
    console.log('serial port open');
});
parser.on('data', data => {
    console.log('got word from arduino:' + data);
    try {
        var jso = JSON.parse(data);
        temp = jso.temp;
        temp_cons = jso.temp_cons;
        hygroAir = jso.hygroAir;
        hygroAir_cons = jso.hygroAir_cons;
        hygroSol = jso.hygroSol;
        hygroSol_cons = jso.hygroSol_cons;
        lum = jso.lum;
        lum_cons = jso.lum_cons;
        console.log("La température déportée est " + temp + " °C");
        console.log("La température consigne est " + temp_cons + " °C");
        console.log("L'hygrométrie de l'air déportée est " + hygroAir + "");
        console.log("L'hygrométrie de l'air consigne est " + hygroAir_cons + "");
        console.log("L'hygrométrie du sol déportée est " + hygroSol + "");
        console.log("L'hygrométrie du sol consigne est " + hygroSol_cons + "");
        console.log("La lumière déportée est " + lum + " Lux");
        console.log("La lumière consigne est " + lum_cons + " Lux");
        io.emit('temp', temp);
        io.emit('hygroAir', hygroAir);
        io.emit('hygroSol', hygroSol);
        io.emit('lum', lum);
        io.emit('temp_cons', temp_cons);
        io.emit('hygroAir_cons', hygroAir_cons);
        io.emit('hygroSol_cons', hygroSol_cons);
        io.emit('lum_cons', lum_cons);
    }

    catch (e) {
        console.error("Parsing error:", e);
    }
});

io.sockets.on('connection', function (socket) {

    socket.on('hygroSolConsIncrement', function (Increment) {
        console.log("increment Sol:" + Increment);
        port.write("A"); //HygroSolCons+

    });

    socket.on('hygroSolConsDecrement', function (Decrement) {
        console.log("decrement Sol:" + Decrement);
        port.write("Z"); //HygroSolCons-

    });

    socket.on('hygroAirConsIncrement', function (Increment) {
        console.log("increment Air:" + Increment);
        port.write("E"); //HygroAirCons+

    });

    socket.on('hygroAirConsDecrement', function (Decrement) {
        console.log("decrement Air:" + Decrement);
        port.write("R"); //HygroAirCons-

    });

    socket.on('tempConsIncrement', function (Increment) {
        console.log("increment Temp:" + Increment);
        port.write("T"); //TempCons+

    });

    socket.on('tempConsDecrement', function (Decrement) {
        console.log("decrement Temp:" + Decrement);
        port.write("Y"); //TempCons-

    });

    socket.on('lumConsIncrement', function (Increment) {
        console.log("increment Lum:" + Increment);
        port.write("U"); //LumCons+

    });

    socket.on('lumConsDecrement', function (Decrement) {
        console.log("decrement Lum:" + Decrement);
        port.write("I"); //LumCons-

    });

    socket.on('validSol', function (Decrement) {
        console.log("Valider sol");
        port.write("O"); //LumCons-

    });

    socket.on('validAir', function (Decrement) {
        console.log("Valider air");
        port.write("P"); //LumCons-

    });

    socket.on('validTemp', function (Decrement) {
        console.log("Valider temp");
        port.write("Q"); //LumCons-

    });

    socket.on('validLum', function (Decrement) {
        console.log("Valider lum:");
        port.write("R"); //LumCons-

    });
}) 
