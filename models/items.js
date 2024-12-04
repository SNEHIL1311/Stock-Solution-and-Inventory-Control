const mongoose = require('mongoose')
const itemSchema = new mongoose.Schema({
    ItemName : String,
    ItemCode : String,
    Quantity : Number,
    Rate : Number ,
    Amount : Number,
})

module.exports = mongoose.model('items', itemSchema);