const http = require('http');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const URL = require("url");
const queryString = require('query-string');

const ProductService = require('./ProductService');

const conf = {
    PORT: 3000
};

const route = {
    ROOT: '/',
    COUNTER: '/counter',
    RESET: '/reset',
    PRODUCT: '/product/',
    STATIC: '/public',
    API: '/api'
};

const staticFiles = {
    BASE_PATH: 'public/',
    INDEX: 'index.html',
    PRODUCT: 'product.html',
    PAGE_NOT_FOUND: 'page_not_found.html'
};

const messages = {
    COUNTER_RESET: 'Счетчик сброшен',
    PRODUCT_NOT_FOUND: 'Введенный вами товар не найден.',
    PAGE_NOT_FOUND: 'Введенная вами страница на сайте не обнаружена.',
    SERVER_ERROR: 'Ошибка сервера'
};

const contentTypes = {
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.png': 'image/png',
    '.html': 'text/html',
    '.htm': 'text/html',
};

const HttpStatus = {
    OK: 200,
    REDIRECT: 301,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501
};


let visitCounter = 0;

function startServer() {
    const server = http.createServer(serveSPA);
    console.log('Server start');
    ProductService.init();
    server.listen(conf.PORT);
}

/*
    Handlers functions.
 */

/**
 * The entry point of SPA.
 */
function serveSPA(req, res) {
    const pathname = getPathname(req);
    try {
        if (isApiRequest(pathname)) {
            serveApi(req, res);
        } else if (isStaticFile(pathname)) {
            serveFile(req, res);
        } else {
            serveFile(req, res, 'spa.html');
        }
    } catch (err) {
        serveInternalError(req, res);
    }
}


/**
 * The entry point.
 */
function mainRouting(req, res) {
    const pathname = getPathname(req);
    try {
        if (isStaticFile(pathname)) {
            serveFile(req, res);
        } else {
            serveDynamicPages(req, res);
        }
    } catch (err) {
        serveInternalError(req, res);
    }
}

/**
 * Handles Api requests
 * @param req Request
 * @param res Response
 */
function serveApi(req, res) {
    const parsed = queryString.parseUrl(req.url);
    const params = parsed.url.replace(route.API + '/', '').split('/');
    switch (params[0]) { // for future usage
        case 'products':
            // setTimeout(function(){ // test delay
            serveApiProducts(req, res, params, parsed.query);
            //},2000);
            break;
        default:
            sendNotFound(res);
    }
}

/**
 * Handles Product Api  requests
 * @param req  Request
 * @param res Response
 * @param params Array of params with first element "products'
 * @param query map of query params
 */
function serveApiProducts(req, res, params, query) {
    if (params.length > 1) {
        ProductService.getProductById(params[1]).then(function (product) {
            if (product) {
                sendJSONResponse(product, res);
            } else {
                sendNotFound(res);
            }
        }).catch(function (err) {
            serveInternalError(req, res, err.message);
        });
    } else {
        ProductService.getProducts(query).then(function (products) {
            sendJSONResponse(products, res);
        });
    }
}


/**
 * Handles static file.
 * @param req Request
 * @param res Response
 * @param customFileName  if present, will be used instead of the request path.
 */
function serveFile(req, res, customFileName) {
    const filename = staticFiles.BASE_PATH + (customFileName ? customFileName : path.basename(req.url));
    if (fs.existsSync(filename)) {
        sendFile(getContentType(filename), filename, res);
    } else {
        serveNotFound(req, res);
    }
}


/**
 * Handle page not found.
 * @param req Request
 * @param res Response
 * @param message if not present, will be used default message.
 */
function serveNotFound(req, res, message) {
    getCompiledEJS(staticFiles.PAGE_NOT_FOUND)
        .then(data => sendHtmlResponse(data({message: (message || messages.PAGE_NOT_FOUND)}), res));
}

/**
 * Handle dynamic pages.
 * @param req Request
 * @param res Response
 */
function serveDynamicPages(req, res) {
    const pathname = getPathname(req);
    if (pathname.indexOf(route.PRODUCT) == 0) {
        serveProduct(req, res);
    } else {
        switch (pathname) {
            case route.ROOT:
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
}

/**
 * Handle product page.
 * @param req Request
 * @param res Response
 */
function serveProduct(req, res) {
    const productInfo = getProductInfo(req);
    ProductService.getProductByKey(productInfo.key).then(function (product) {
        if (product) {
            if (productInfo.slug === product.slug) {
                getCompiledEJS(staticFiles.PRODUCT)
                    .then(data => sendHtmlResponse(data({product: product}), res));
            } else {
                sendRedirect(res, getProductPath(product));
            }
        } else {
            serveNotFound(req, res, messages.PRODUCT_NOT_FOUND);
        }
    });
}

/**
 * Handle  main page.
 * @param req Request
 * @param res Response
 */
function serveIndex(req, res) {
    visitCounter++;
    ProductService.getProducts().then(function (products) {
        getCompiledEJS(staticFiles.INDEX)
            .then(ejs => sendHtmlResponse(ejs({products: products}), res));
    });
}

/**
 * Handle count of visits main page.
 * @param req Request
 * @param res Response
 */
function serveCounter(req, res) {
    sendHtmlResponse(HttpStatus.OK, visitCounter.toString(), res);
}

/**
 * Reset count of visits main page.
 * @param req Request
 * @param res Response
 */
function serveReset(req, res) {
    visitCounter = 0;
    sendHtmlResponse(HttpStatus.OK, messages.COUNTER_RESET, res);
}

/**
 * Handle server error.
 * @param req Request
 * @param res Response
 * @param message  if not present, will be used default message.
 */
function serveInternalError(req, res, message) {
    res.statusCode = HttpStatus.SERVER_ERROR;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.write(message || messages.SERVER_ERROR);
    res.end();
}

/**
 * Creates compiled EJS by file name.
 * @param filename
 * @returns  Compiled EJS.
 */
function getCompiledEJS(filename) {
    return new Promise(function (resolve, reject) {
        fs.readFile(staticFiles.BASE_PATH + filename, 'utf-8', function (err, data) {
            if (!err) {
                resolve(ejs.compile(data.toString()));
            } else {
                reject(err);
            }
        });
    });
}

/*
    Functions for work with paths.
 */

/**
 * Get key and slug of product.
 * @param req  Request
 * @returns {{key: string, slug: string}}  Key and slug of product.
 */
function getProductInfo(req) {
    const parsedURL = URL.parse(req.url);
    const slugPart = parsedURL.path.replace(route.PRODUCT, '');
    const parts = slugPart.split('-');
    const key = parts[0];
    const slug = slugPart.slice(key.length + 1);
    return {
        key: key,
        slug: slug
    };
}

/**
 * Create path of product page.
 * @param productInfo Must contain key and slug of product.
 * @returns {string} of product page.
 */
function getProductPath(productInfo) {
    return route.PRODUCT + productInfo.key + '-' + productInfo.slug;
}

/**
 * Get path  from URL.
 * @param req Request
 * @returns {string}
 */
function getPathname(req) {
    const parsedURL = URL.parse(req.url);
    return parsedURL.pathname;
}

/**
 * Check path is static file or dynamic page.
 * @param filename
 * @returns {boolean} return true if the path is a file
 */
function isStaticFile(filename) {
    return (filename.indexOf(route.STATIC) == 0);
}

/**
 * Check path is API request
 * @param path
 * @returns {boolean} return true if the path is a file
 */
function isApiRequest(path) {
    return (path.indexOf(route.API) == 0);
}

/**
 * Gets Content-Type by extension of file.
 * @param filename
 * @returns {string} Content-Type header
 */
function getContentType(filename) {
    const extension = path.extname(filename);
    const type = contentTypes[extension];
    return (contentTypes[extension] === undefined) ? 'text/plain' : type;
}

/*
   Response Functions
 */

function sendFile(type, filename, res) {
    const fileStream = fs.createReadStream(filename);
    res.setHeader('Content-Type', type);
    fileStream.pipe(res);
}

function sendNotFound(res) {
    res.statusCode = HttpStatus.NOT_FOUND;
    res.end();
}

function sendHtmlResponse(body, res) {
    res.statusCode = HttpStatus.OK;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.write(body);
    res.end();
}

function sendJSONResponse(obj, res) {
    res.statusCode = HttpStatus.OK;
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify(obj));
    res.end();
}

function sendRedirect(res, location) {
    res.statusCode = HttpStatus.REDIRECT;
    res.setHeader('Location', location);
    res.end();
}

startServer();

