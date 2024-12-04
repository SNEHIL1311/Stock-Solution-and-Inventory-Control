const mongoose = require('mongoose')
const invoiceSchema = new mongoose.Schema({
    items : Object,
    id : String,
    totalAmount : Number,
    orderId :String,
    date: String,
    Name : String
})

module.exports = mongoose.model('Invoice', invoiceSchema);