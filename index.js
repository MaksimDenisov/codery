const http = require('http');
const path = require('path');
const fs = require('fs');

const conf = {
    PORT: 3000
};

const route = {
    BASE: "/",
    COUNTER: "/counter",
    RESET: "/reset"
};

let counter = 0;

function handler(req, res) {
    const URL = require("url");
    const parsedURL = URL.parse(req.url);
    console.log(parsedURL);
    console.log("Path", parsedURL.pathname);
    switch (parsedURL.pathname) {
        case route.BASE:
            serveIndex(req, res);
            break;
        case route.COUNTER:
            serveCounter(req, res);
            break;
        case route.RESET:
            serveReset(req, res);
            break;
        default:
            serveOther(req, res);
    }
}

function serveOther(req, res, customFileName) {
    const filename = customFileName ? customFileName : path.basename(req.url);
    const extension = path.extname(filename);
    let type;
    switch (extension) {
        case ".css":
            type = "text/css";
        case ".js":
            type = "text/javascript";
        case ".png":
            type = "image/png";
        case ".html":
        case ".htm":
            type = "text/html";
            sendStatic(type, filename, res);
            break;
        default:
            serveNotFound(req, res);
    }
}

function serveIndex(req, res) {
    counter++;
    serveOther(req, res, "index.html");
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

function sendStatic(type, filename, res) {
    let content;
    try {
        content = fs.readFileSync("static/" + filename);
        res.statusCode = 200;
        res.setHeader("Content-Type", type);
        res.write(content);
        res.end();
    } catch (err) {
        res.statusCode = 404;
        res.end();
    }
}

function sendResponse(code, body, res) {
    res.statusCode = code;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.write(body);
    res.end();
}

const server = http.createServer(handler);
console.log("Server start");
server.listen(conf.PORT);