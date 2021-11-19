const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;


require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

const cors = require('cors');
app.use(express.json())

// mongodb Uri
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bsoks.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// to check the uri 
console.log(uri);

// midddleware
app.use(cors());

async function run() {
    try{
        await client.connect();
        const database = client.db('motoland_db');
        const serviceCollection = database.collection('motoservices');
        const exploreCollection = database.collection('explore');
        const orderCollection = database.collection('orders');
        const reviewCollection = database.collection('reviews');
        const usersCollection = database.collection('users');


        // GET services API
        app.get('/services', async(req, res) =>{
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })
        // GET Explore data API
        app.get('/explore', async(req, res) =>{
            const cursor = exploreCollection.find({});
            const services = await cursor.toArray();
            res.send(services);

        })
         // GET SingleProduct API
         app.get('/singleProduct/:id', async(req, res) =>{
            const result = await serviceCollection.find({_id: ObjectId(req.params.id)}).toArray();
            res.send(result[0]);
        })
         // Get Single service
        app.get('/services/:id', async(req, res) => {
            const id = req.params.id;
            console.log('getting specficic id', id);
            const query = {_id: ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            res.send(service);
        })
         // Get Single explore service
        app.get('/explore/:id', async(req, res) => {
            const id = req.params.id;
            console.log('getting specficic id', id);
            const query = {_id: ObjectId(id)};
            const service = await exploreCollection.findOne(query);
            res.send(service);
        })
        


       // add ConfirmOrder POST API
       app.post('/confirmOrder', async (req, res) => {
        const result = await orderCollection.insertOne(req.body);
        // console.log(result);
        res.send(result);
        // console.log(req.body);
        // http://localhost:5000/confirmOrder  
        })

        // get my orders api
        app.get('/myOrderss/:email', async(req, res) =>{
            const result = await orderCollection.find({email: req.params.email}).toArray();
            // res.send(result[0]);
            res.send(result);
        })
        // delete Order
        app.delete('/deleteOrder/:id', async (req, res) => {
            const result = await orderCollection.deleteOne({_id: ObjectId(req.params.id)});
            res.send(result);
        })
        // deleteProduct
        app.delete('/deleteProduct/:id', async (req, res) => {
            const result = await exploreCollection.deleteOne({_id: ObjectId(req.params.id)});
            res.send(result);
        })

        // add Services POST API
        app.post('/addreview', async (req, res) => {
            const result = await reviewCollection.insertOne(req.body);
            res.send(result);
            // console.log(req.body);
        })
        // add a product - for ADMIN
        app.post('/addaproduct', async (req, res) => {
            const result = await exploreCollection.insertOne(req.body);
            res.send(result);
            // console.log(req.body);
        })
        // add users POST API
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            console.log(result);
            res.send(result);
            // console.log(req.body);
        })
        // users/admin put method
        app.put('/users', async(req, res) => {
            const user = req.body;
            const filter = {email: user.email};
            const updateDoc = {$set: {role: 'admin'}};
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);
        })
        // get email info for making admin
        app.get('/users/:email', async(req, res) => {
            const email = req.params.email;
            const query = { email: email };
            let isAdmin = false;
            const user = await usersCollection.findOne(query);
            if (user?.role === 'admin'){
                isAdmin = true;
            }
            res.json({admin: isAdmin});
        })
         // GET REviews API
         app.get('/reviews', async(req, res) =>{
            const cursor = reviewCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })
        // GET manageOrders  API for ADMIN
        app.get('/manageallorders', async(req, res) =>{
            const cursor = orderCollection.find({});
            const allorders = await cursor.toArray();
            res.send(allorders);
        })
        // GET manageOrders  API for ADMIN
        app.get('/manageProducts', async(req, res) =>{
            const cursor = exploreCollection.find({});
            const allorders = await cursor.toArray();
            res.send(allorders);
        })



        console.log("database connected successfully");
    }
    finally{

    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('MOTOLAND-MONGO-SERVER is RUNNING.');
})

app.listen(port, () => {
    console.log("Server running at port:", port);
})




