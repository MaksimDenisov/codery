const express = require('express');
const app = express();

const path = require('path');
const bodyParser = require('body-parser');
const jsonBodyParser = bodyParser("json");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const DBService = require('./DBService');

const messages = require('./static/config/Messages.js');
const HttpStatus = require('./static/config/HttpStatus.js');
const conf = require('./config.js');


function startServer() {
    DBService.init();

    app.use(cookieParser());

    app.get('/', serveSPA);
    app.get('/products/:key_and_slug', serveSPA);

    app.get('/panel', serveSPA);
    app.get('/panel/login', serveSPA);
    app.get('/panel/product', serveSPA);
    app.get('/panel/product/:id', serveSPA);

    app.use(jsonBodyParser);

    app.get('/api/me', checkToken);
    app.get('/api/me', serveApiMe);

    app.get('/api/bcrypt', serveApiBcrypt);

    app.post('/api/login', serveApiLogin);

    app.get('/api/products', serveApiProducts);

    app.post('/api/products/', checkToken);
    app.post('/api/products/', serveApiCreateOneProduct);

    app.get('/api/products/:id', checkToken);
    app.get('/api/products/:id', serveApiOneProduct);

    app.put('/api/products/:id', checkToken);
    app.put('/api/products/:id', serveApiUpdateOneProduct);

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
 * Handles Api  requests
 */

/**
 * SERVICE TEST FUNCTION
 * Get encrypted string from password
 * @param req Request Need contain "query" param
 * @param res Response encrypted string
 */
function serveApiBcrypt(req, res) {
    const password = req.query.password;
    res.status(HttpStatus.OK);
    res.write(bcrypt.hashSync(password, conf.SALT_ROUNDS));
    res.end();
}

/**
 * Login API function
 * @param req Request
 * @param res Response
 */
function serveApiLogin(req, res) {
    const email = req.body.login;
    const password = req.body.password;
    DBService.getUserByEmail(email).then(function (user) {
        if ((user == null) || (!bcrypt.compareSync(password, user.password))) {
            throw new Error(messages.common.INCORRECT_LOGIN_OR_PASSWORD);
        }
        const payload = {
            email: user.mail
        };
        const token = jwt.sign(payload, conf.SECRET_KEY, {
            expiresIn: conf.EXPIRED_TIME
        });
        console.log('Login user with mail :' + email);
        res.cookie('token', token, {encode: String});
        res.json({user: user.mail});
        res.end();
    }).catch(function (err) {
        console.log('Access denied for user with mail :' + email);
        res.status(HttpStatus.FORBIDDEN);
        res.write(messages.common.INCORRECT_LOGIN_OR_PASSWORD);
        res.end();
    });
}

/**
 *
 * @param req
 * @param res
 * @param next
 */
function checkToken(req, res, next) {
    try {
        const payload = jwt.verify(req.cookies.token, conf.SECRET_KEY);
        req.user = {mail: payload.email};
        next();
    } catch (err) {
        res.status(HttpStatus.UNAUTHORIZED);
        res.write(messages.common.UNAUTHORIZED);
        res.end();
    }
}

/**
 * Return user mail.
 * @param req Request
 * @param res Response
 */
function serveApiMe(req, res) {
    res.status(HttpStatus.OK);
    res.write(req.user.mail);
    res.end();
}

/**
 * Handle products request.
 * Request May contains query.
 * Response containing a list of products
 * @param req Request
 * @param res Response
 */
function serveApiProducts(req, res) {
    DBService.getProducts(req.query).then(function (products) {
        res.json(products);
    }).catch(function (err) {
        res.status(HttpStatus.NOT_FOUND);
        res.write(messages.common.PRODUCT_NOT_FOUND);
        res.end();
    });
}

/**
 * Get one product by id.
 * @param req
 * @param res
 */
function serveApiOneProduct(req, res) {
    DBService.getProductById(req.params.id).then(function (product) {
        if (product) {
            res.json(product);
        } else {
            res.send({error: messages.common.PRODUCT_NOT_FOUND});
        }
    }).catch(function (err) {
        serveInternalError(req, res, err.message);
    });
}

/**
 * Add new product.
 * @param req
 * @param res
 */
function serveApiCreateOneProduct(req, res) {
    req.body.key = Number(req.body.key);
    DBService.createProduct(req.body)
        .then(function (result) {
            const insertedItem = result.ops[0];
            res.json(insertedItem);
        });
}

/**
 * Update one product by id.
 * @param req
 * @param res
 */
function serveApiUpdateOneProduct(req, res) {
    req.body.key = Number(req.body.key);
    DBService.updateProduct(req.params.id, req.body)
        .then(function (result) {
            res.json(result);
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

