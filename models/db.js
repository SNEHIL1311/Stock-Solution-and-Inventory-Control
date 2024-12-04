const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/studb',{
}).then(()=>{
    console.log("Connected to Database!!")
}).catch((err)=>{
    console.log(err)
})

require('./items')