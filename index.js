const http = require('http');
let counter = 0;


function handler(req, res) {
    const URL = require("url");
    const parsedURL = URL.parse(req.url);
    console.log(parsedURL);
    console.log("Path", parsedURL.pathname);
    switch (parsedURL.pathname) {
        case "/":
            serveIndex(req, res);
            break;
        case "/counter":
            serveCounter(req, res);
            break;
        case "/reset":
            serveReset(req, res);
            break;
        default:
            serveNotFound(req, res);
    }
}

function serveIndex(req, res) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    counter++;
    res.write("Main Page");
    res.end();
}

function serveCounter(req, res) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.write(counter.toString());
    res.end();
}

function serveReset(req, res) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    counter = 0;
    res.write("Счетчик сброшен");
    res.end();
}

function serveNotFound(req, res) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.write("Not found");
    res.end();
}


const server = http.createServer(handler);
console.log("Server start");
server.listen(3000);