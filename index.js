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
    counter++;
    sendResponse(200, "Main Page", res);
}

function serveCounter(req, res) {
    sendResponse(200, counter.toString(), res);
}

function serveReset(req, res) {
    counter = 0;
    sendResponse(200, "Счетчик сброшен", res);
}

function serveNotFound(req, res) {
    sendResponse(404, "Not found", res);
}

function sendResponse(code, body, res) {
    res.statusCode = code;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.write(body);
    res.end();
}

const server = http.createServer(handler);
console.log("Server start");
server.listen(3000);