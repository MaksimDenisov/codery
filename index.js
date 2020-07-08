const http = require('http');
const path = require('path');
const fs = require('fs');

const conf = {
    PORT: 3000
};

const route = {
    BASE: "/",
    COUNTER: "/counter",
    RESET: "/reset",
    PRODUCT: "/product"
};

let counter = 0;

function handler(req, res) {
    const URL = require("url");
    const parsedURL = URL.parse(req.url);
    console.log(parsedURL);
    console.log("Path", parsedURL.pathname);
    try {
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
            case route.PRODUCT:
                serveProduct(req, res);
                break;
            default:
                serveOther(req, res);
        }
    } catch (err) {
        serveInternalError(req, res);
    }
}

function serveOther(req, res, customFileName) {
    const filename = "static/" + (customFileName ? customFileName : path.basename(req.url));
    if (fs.existsSync(filename)) {
        const extension = path.extname(filename);
        let type;
        switch (extension) {
            case ".css":
                type = "text/css";
                break;
            case ".js":
                type = "text/javascript";
                break;
            case ".png":
                type = "image/png";
                break;
            case ".html":
            case ".htm":
                type = "text/html";
                break;
            default:
                type = -"text/plain";
        }
        sendStatic(type, filename, res);
    } else {
        serveNotFound(req, res);
    }
}

function serveProduct(req, res) {
    serveOther(req, res, "product.html");
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

function serveInternalError(req, res) {
    sendResponse(500, "Internal Server Error", res);
}

function sendStatic(type, filename, res) {
    const fileStream = fs.createReadStream(filename);
    res.setHeader("Content-Type", type);
    fileStream.pipe(res);
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