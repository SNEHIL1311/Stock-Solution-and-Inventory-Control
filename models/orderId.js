const mongoose = require('mongoose')
const orderSchema = new mongoose.Schema({


    orderid :{
        type : Number
    }
})

module.exports = mongoose.model('orderid', orderSchema);