const MongoClient = require('mongodb').MongoClient;

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

    getProducts() {
        const cursor = productCollection.find();
        return cursor.toArray();
    },

    getProductByKey(key) {
        return productCollection.findOne({'key': parseInt(key)});
    }
};


