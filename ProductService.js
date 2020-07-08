let products = [];
module.exports = {
    init() {
        products.push({
            title: "ПВУ Turkov ZENIT 350 HECO",
            img: "product1.png",
            slug: "pvu-turkov-zenit-isp-1",
            key: 1,
            description: "Вентиляционная установка с рекуперацией тепла и влаги ...",
            price: 10000
        });
        products.push({
            title: "ПВУ Turkov ZENIT 350 HECO исп.2",
            img: "product2.png",
            slug: "pvu-turkov-zenit-isp-2",
            key: 2,
            description: "Вентиляционная установка с улучшеной рекуперацией тепла и влаги ...",
            price: 15000
        });
    },

    getProducts() {
        return products;
    },

    getProductByKey(key) {
        return products.find(element => element.key === parseInt(key));
    }
};