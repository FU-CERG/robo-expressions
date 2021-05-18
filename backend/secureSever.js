const fs = require('fs');
const https = require('https');
const WebSocket = require('ws');

const server = https.createServer({
    cert: fs.readFileSync('C:\\cygwin64\\home\\Margarita\\rootSSL.pem'),
    key: fs.readFileSync('C:\\cygwin64\\home\\Margarita\\rootSSL.key'),
    passphrase: "12345"
});

const actions = [
    "smiling",
    "checkright",
    "checkleft",
    "giggling",
    "dubitative",
    "sad",
    "reallysad",
    "bored",
    "dubitative",
    "chock",
    "suspicious",
    "satisfied",
    "pong",
    "killthehumans",
    "hal9000"
]

let CLIENTS = {}

const wss = new WebSocket.Server({ server, port: 8080 });

wss.on('connection', function connection(ws, request) {
    // remove query params
    let url = request.url.split("?")[0]

    // users need to specify a custom room
    if (url.length < 2) {
        ws.close()
    }

    if (CLIENTS[url] && CLIENTS[url].length > 0) {
        CLIENTS[url].push(ws)
    }
    else {
        CLIENTS[url] = [ws]
    }
    console.log(url)
    ws.on("message", function incoming(message) {
        console.log("received: %s", message)
        if (actions.indexOf(message.toLowerCase()) > -1) {
            for (var j = 0; j < CLIENTS[url].length; j++) {
                CLIENTS[url][j].send(message.toLowerCase())
            }
        }
    })
});