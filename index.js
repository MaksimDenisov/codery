const express = require('express');
const app = express();

const path = require('path');
const bodyParser = require('body-parser');
const jsonBodyParser = bodyParser("json");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const saltRounds = 10;

const DBService = require('./DBService');

const conf = {
    PORT: 3000
};

const messages = {
    COUNTER_RESET: 'Счетчик сброшен',
    PRODUCT_NOT_FOUND: 'Введенный вами товар не найден.',
    PAGE_NOT_FOUND: 'Введенная вами страница на сайте не обнаружена.',
    SERVER_ERROR: 'Ошибка сервера',
    UNAUTHORIZED: 'Не авторизован'
};

const HttpStatus = {
    OK: 200,
    REDIRECT: 301,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501
};

const SECRET = "zxcvbnmasdfghjklqwertyuiop";


function startServer() {
    DBService.init();

    app.use(cookieParser());

    app.get('/', serveSPA);
    app.get('/products/:key_and_slug', serveSPA);

    app.get('/login', serveLogin);
    app.get('/login2', serveLogin2);

    app.get('/panel', serveSPA);
    app.get('/panel/product', serveSPA);
    app.get('/panel/product/:id', serveSPA);

    app.use(jsonBodyParser);

    app.get('/api/bcrypt', serveApiBcrypt);
    app.get('/api/login', serveApiLogin);

    app.get('/api/products', serveApiProducts);

    app.get('/api/me', checkToken);
    app.get('/api/me', serveApiMe);

    app.get('/api/products/:id', checkToken);
    app.get('/api/products/:id', serveApiOneProduct);

    app.put('/api/products/:id', checkToken);
    app.put('/api/products/:id', serveApiUpdateOneProduct);

    app.get('/api/products/:id', checkToken);
    app.get('/api/products/:id', serveApiCreateOneProduct);


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
 * Login function
 * must set cookie
 * @param req Request
 * @param res Response
 */
function serveLogin(req, res) {
    const payload = {
        email: "user@mail.com"
    };
    const token = jwt.sign(payload, SECRET, {
        expiresIn: "5m"
    });
    res.cookie('token', token, {encode: String});
    res.end();
}

/**
 * Login function
 * must set cookie by express
 * @param req Request
 * @param res Response
 */
function serveLogin2(req, res) {
    res.cookie('user', 'user2@mail.com', {encode: String});
    res.end();
}

/**
 * Get bcrypt string
 * @param req Request
 * @param res Response
 */
function serveApiBcrypt(req, res) {
    const password = req.query.password;
    res.status(HttpStatus.OK);
    res.write(bcrypt.hashSync(password, saltRounds));
    res.end();
}


/**
 * Login API function
 * @param req Request
 * @param res Response
 */
function serveApiLogin(req, res) {
    const email = req.query.email;
    const password = req.query.password;

    DBService.getUserByEmail(email).then(function (user) {
        console.log(user);
        if (!user) {
            throw 'No user';
        }
        if (!bcrypt.compareSync(password, user.password)) {
            throw 'Incorrect password';
        }
        const payload = {
            email: user.mail
        };
        const token = jwt.sign(payload, SECRET, {
            expiresIn: "5m"
        });
        res.cookie('token', token, {encode: String});
        res.write('Token received');
        res.end();
    }).catch(function (err) {
        res.status(HttpStatus.FORBIDDEN);
        res.write(err);
        res.end();
    });
}


function checkToken(req, res, next) {
    try {
        const payload = jwt.verify(req.cookies.token, SECRET);
        console.log(payload);
        req.user = {mail: payload.email};
        next();
    } catch (err) {
        res.status(HttpStatus.UNAUTHORIZED);
        res.write(messages.UNAUTHORIZED);
        res.end();
    }
}

/**
 * Return cookie.
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
            res.send({error: 'Not found'});
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

