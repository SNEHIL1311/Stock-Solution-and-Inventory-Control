const mongoose = require('mongoose')
const purchaseItemSchema = new mongoose.Schema({
    orderId : Number,
    ItemName : String,
    Quantity : Number,
    Rate : Number ,
    Amount : Number,
})

module.exports = mongoose.model('purchaseItems', purchaseItemSchema);