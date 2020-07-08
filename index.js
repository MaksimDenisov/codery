const http = require('http');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const URL = require("url");

const ProductService = require("./ProductService");

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
                if (parsedURL.pathname.indexOf("/product/") === 0) {
                    serveProduct(req, res);
                } else {
                    serveOther(req, res);
                }
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
    const parsedURL = URL.parse(req.url);
    const a = parsedURL.path.replace("/product/", "").split("-");
    ProductService.getProductByKey(a[0]).then(function (result) {
        if (result) {
            const scope = {
                product: result
            };
            processEJS(res, "static/product.html", scope);
        } else {
            serveNotFound(req, res);

        }
    });
}

function serveIndex(req, res) {
    counter++;
    ProductService.getProducts().then(function (result) {
        const scope = {
            products: result
        };
        processEJS(res, "static/index.html", scope);
    });

}

function processEJS(res, filename, scope) {
    fs.readFile(filename, 'utf-8', function (err, data) {
        if (!err) {
            const template = ejs.compile(data.toString());
            const html = template(scope);
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            res.write(html);
            res.end()
        } else {
            console.log(err);
        }
    });
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
    res.statusCode = 500;
    res.write("Server Internal Error");
    res.end();
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
ProductService.init();
server.listen(conf.PORT);