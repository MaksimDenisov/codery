const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

let shopDatabase;
let productCollection;
let userCollection;

module.exports = {
    init() {
        MongoClient.connect('mongodb://localhost:27017')
            .then(function (clientInstance) {
                shopDatabase = clientInstance.db("shop");
                productCollection = shopDatabase.collection("product");
                userCollection = shopDatabase.collection("user");
            });
    },

    getProducts(where) {
        let cursor;
        if (where) {
            if (where.key) {
                where.key = Number(where.key);
            }
            cursor = productCollection.find(where);
        } else {
            cursor = productCollection.find();
        }
        return cursor.toArray();
    },

    getProductById(id) {
        let mongoId;
        try {
            mongoId = ObjectID(id);
        } catch (err) {
            return Promise.reject(err);
        }
        return productCollection.findOne({_id: mongoId});
    },

    updateProduct(id, patch) {
        delete patch._id;
        return new Promise(function (resolve, reject) {
            productCollection.update(
                {_id: ObjectID(id)},
                {
                    $set: patch
                }).then(resolve());
        }).then(function (result) {
            let mongoId;
            mongoId = ObjectID(id);
            return productCollection.findOne({_id: mongoId});
        });
    },

    createProduct(body) {
        return productCollection.insert(body);
    },

    getUserByEmail(mail) {
        return userCollection.findOne({mail: mail});
    },

};



