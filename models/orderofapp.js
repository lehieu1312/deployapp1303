let mongoose = require('mongoose');

let order = mongoose.Schema({
    idApp: String,
    nameApp: String,
    codeOrder: String,
    idOrder: String,
    idCustomer: String,
    nameCustomer: String,
    userNameCustomer: String,
    email: String,
    address: String,
    phoneNumber: String,
    addressShip: String,
    note: String,
    idUser: String,
    nameUser: String,
    emailUser: String,
    phoneNumberUser: Number,
    addressUser: String,
    product: [{
        idProduct: String,
        image: String,
        nameProduct: String,
        size: String,
        color: String,
        productCode: String,
        price: Number,
        quantity: Number
    }],
    discount: Number,
    feeShip: Number,
    feeVat: Number,
    totalMonney: Number,
    methodPayment: String,
    methodOrder: String,
    curency: String,
    dateCreate: Date,
    statusOrder: Number,
    status: Boolean
});

let orderofapp = module.exports = mongoose.model('orderofapps', order);