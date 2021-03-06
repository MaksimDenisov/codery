const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

let shopDatabase;
let productCollection;

module.exports = {
    init() {
        MongoClient.connect('mongodb://localhost:27017')
            .then(function (clientInstance) {
                shopDatabase = clientInstance.db("shop");
                productCollection = shopDatabase.collection("product");
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

    getProductByKey(key) {
        return productCollection.findOne({'key': parseInt(key)});
    },

    getProductById(id) {
        let mongoId;
        try {
            mongoId = ObjectID(id);
        } catch (err) {
            return Promise.reject(err);
        }
        return productCollection.findOne({_id: mongoId});
    }
};



