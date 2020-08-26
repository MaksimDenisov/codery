const express = require('express');
const app = express();

const path = require('path');

const ProductService = require('./ProductService');

const conf = {
    PORT: 3000
};

const messages = {
    COUNTER_RESET: 'Счетчик сброшен',
    PRODUCT_NOT_FOUND: 'Введенный вами товар не найден.',
    PAGE_NOT_FOUND: 'Введенная вами страница на сайте не обнаружена.',
    SERVER_ERROR: 'Ошибка сервера'
};

const HttpStatus = {
    OK: 200,
    REDIRECT: 301,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501
};

function startServer() {
    ProductService.init();
    app.get('/', serveSPA);
    app.get('/products/:key_and_slug', serveSPA);

    app.get('/api/products', serveApiProducts);
    app.get('/api/products/:id', serveApiOneProduct);

    app.use('/public', express.static('public'));
    app.use(serveNotFound);

    app.listen(conf.PORT, function () {
        console.log("Server started");
    });
}

/*
    Handlers functions.
 */

/**
 * The entry point of SPA.
 */
function serveSPA(req, res) {
    res.sendFile(path.resolve('public/spa.html'));
}

/*
 * Handles Product Api  requests
 */

/**
 * Handle products request.
 * Request May contains query.
 * Response containing a list of products
 * @param req Request
 * @param res Response
 */
function serveApiProducts(req, res) {
    ProductService.getProducts(req.query).then(function (products) {
        res.json(products);
    });
}

/**
 * Get one product by id.
 * @param req
 * @param res
 */
function serveApiOneProduct(req, res) {
    ProductService.getProductById(req.params.id).then(function (product) {
        if (product) {
            res.json(product);
        } else {
            res.send({error: 'Not found'});
        }
    }).catch(function (err) {
        serveInternalError(req, res, err.message);
    });
}

/**
 * Handle page not found.
 * @param req Request
 * @param res Response
 * @param message if not present, will be used default message.
 */
function serveNotFound(req, res, message) {
    res.status(404).sendFile(path.resolve('public/spa.html'));
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

startServer();

