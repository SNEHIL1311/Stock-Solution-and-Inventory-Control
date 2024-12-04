
const express = require('express')
const app = express()

const bodyParser = require('body-parser');

const db = require('./models/db')
const items = require('./models/items')

app.use(express.json());

app.set('view engine','ejs');

const purchaseItems = require('./models/purchaseItem')

// const orders = require('./models/orderId')

const Invoice = require('./models/invoice');
const orderid = require('./models/orderId');


app.use(bodyParser.urlencoded({extended:false}));

app.post("/save-invoice", async (req, res) => {
    try {
        console.log(req.body);
        const inv = new Invoice();
        inv.orderId = req.body.orderid;
        inv.date = req.body.billdate;
        inv.Name = req.body.name;
        inv.totalAmount = req.body.total;

        const items = await purchaseItems.find();

        if (!items || items.length === 0) {
            return res.status(404).send("No items found.");
        }

        inv.items = items;
        await inv.save();

        // Delete all purchase items
        await purchaseItems.deleteMany({});
        

        res.redirect("get-item");
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred while saving the invoice.");
    }
});



app.get("/order-id",(req,res)=>{
    orderid.find()
    .then((data)=>{
        res.send(data[0]);
    })
    .catch((err)=>{
        console.log(err)
    })
})

app.get("/updateOrderId",(req,res)=>{
    orderid.updateOne(
        { $inc: { orderid: +1 } }
     )
    .then((data)=>{
        res.send(data);
    })
    .catch((err)=>{
        console.log(err)
    })
})
app.patch("/update-order-id",(req,res)=>{
    orderid.findOne()
    .then((data)=>{
        if(data)
        {
            orderid.updateOne({$set : {orderId : data.orderId + 1}})
            .then(() => {
                res.send( "Order ID updated successfully!" );
            })
            .catch((err) => {
                res.status(500).send( "Failed to update order ID");
            });
        } else {
                res.status(404).send("Order ID not found" );
                }
        })
            .catch((err) => {
            res.status(500).send({ error: "Failed to fetch order ID" });
        });
    })


app.get("/date", (req, res) => {
    // const currentDate = new Date(); 
    const now = new Date();
    const currentDate = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} `;

    res.send({ currentDate });
});


app.get("/",(req,res)=>{
    items.find()
    .then((data)=>{
        res.render("index.ejs",{data:data})
    })
    .catch((err)=>{
        console.log(err)
    })
})

app.get("/item",(req,res)=>{
   
   res.render("show")
})

app.get("/invoice-item-bill", async (req, res) => {
    try {
        
        const invoices = await Invoice.find({}, { orderId: 1, totalAmount: 1, _id: 0 });
        res.json(invoices);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error retrieving data.");
    }
});



app.get("/item/:name", async (req, res) => {
    const itemName = req.params.name;
    try {
       
        const item = await items.findOne({ ItemName: itemName });

        if (item) {
            console.log(item.Rate)
            console.log(item.Quantity)
            res.json(item.Rate)
        } else {
            res.status(404).send("Item not found.");
        }

    } catch (err) {
        console.error(err); 
        res.status(500).send("Something went wrong!");
    }
});
app.get("/show-suggestion", async (req, res) => {
    try {
        var key=req.query.key;
        var query=key
        console.log(key)
        items.find()
        
        .then((data)=>{
            console.log(data)
            res.send(data)
        })
        .catch((err)=>{
            console.log("Error :"+err);
        })
    } catch (err) {
        res.status(400).send("Something Went Wrong !!");
    }
});

app.get("/show-rate/",async(req, res)=>{
    const itemName = req.query.key;
    try {
       
        const item = await items.findOne({ ItemName: itemName });

        if (item) {
            console.log(item.Rate)
            res.send({rate : item.Rate})
        } else {
            res.status(404).send("Item not found.");
        }

    } catch (err) {
        console.error(err); 
        res.status(500).send("Something went wrong!");
    }
});



//Saving data in database ..
app.post("/add-item", (req, res) => {
    const data = new purchaseItems(req.body);
    //console.log(data)
    data.save(); 
    res.redirect("/get-item");
});

app.get("/view-bill/:orderId",(req,res)=>{
    const orderId = req.params.orderId;
    
    const invoice =  Invoice.findOne({orderId : orderId})
    console.log(invoice);

    res.render("bill", { invoice:invoice,orderId });
})

// app.get("view-bill/:orderId",(req,res)=>{
//     const orderId = req.params.orderId;
//     console.log(orderId)
//     // const invoice =  Invoice.findOne({orderId : orderId})
//     // res.render("bill", { invoice });
//     res.send(orderId);
// })

// app.get("/view-bill",(req,res)=>{
//     res.render("bill");
// })

    app.get("/get-item", (req, res) => {
        purchaseItems.find()
            .then((data1) => {
                //console.log(data1);
                res.render("show.ejs", { data1:data1 });
            })
            .catch((err) => {
                console.log(err);
                res.status(500).send("Error retrieving data.");
            });
    });

    app.get("/delete",async(req,res)=>{
        var id=req.query.id
        await purchaseItems.findByIdAndDelete(id)
        res.redirect("/get-item")
        
    })


    app.get("/citem",async(req, res)=>{
        const itemName = req.query.key;
        try {
           
            const item = await purchaseItems.findOne({ ItemName: itemName });
            if(item)
            {
                res.send({data:item})
            }else{
                res.send({data:null})
            }
    
        } catch (err) {
            console.error(err); 
            res.status(500).send("Something went wrong!");
        }
    });

    // app.get("/update-item",async(req,res)=>{
    //     const itemName = req.query.ItemName;
    //     const qty = req.query.Quantity;
    //     const amount = req.query.Amount;

    //     purchaseItems.updateOne({ItemName : itemName},{$set :{ Quantity : qty, Amount : amount}})
    //     .then((data)=>{
    //         console.log(data)
    //     })  
    // })


    app.get("/update-item", async (req, res) => {
        const itemName = req.query.ItemName;
        const addedQty = parseInt(req.query.qty); 
    
        try {
            
            const item = await purchaseItems.findOne({ ItemName: itemName });
            if (item) {
                const updatedQty = item.Quantity + addedQty; 
                const updatedAmount = updatedQty * item.Rate; 
    
                
                const result = await purchaseItems.updateOne(
                    { ItemName: itemName },
                    { $set: { Quantity: updatedQty, Amount: updatedAmount } }
                );
    
                console.log("Update Result:", result);
                res.send({ msg: "Item updated successfully!" });
            } else {
                res.status(404).send({ msg: "Item not found!" });
            }
        } catch (err) {
            console.error(err);
            res.status(500).send("Something went wrong!");
        }
    });
    


    
    

app.listen(3000,()=>{
    console.log("Server is Running !!")
})