const http = require('http');
const util = require('util');

const conf = {
    PORT: 3000
};

const route = {
    BASE: "/",
    COUNTER: "/counter",
    RESET: "/reset"
};

let counter = 0;
const titleMainPage = "Main Page";
const counterLink = getLink(route.COUNTER, "Счетчик");
const resetLink = getLink(route.RESET, "Сброс");

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
            serveNotFound(req, res);
    }
}

function serveIndex(req, res) {
    counter++;
    sendResponse(200, titleMainPage + "<br>" + counterLink + "<br>" + resetLink, res);
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
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.write(body);
    res.end();
}

function getLink(href, text) {
    return util.format('<a href="%s">%s</a>', href, text)
}

const server = http.createServer(handler);
console.log("Server start");
server.listen(conf.PORT);