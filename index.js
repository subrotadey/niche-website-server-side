const express = require('express')
const app = express()
const ObjectId = require('mongodb').ObjectId
const { MongoClient } = require('mongodb');
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())

// connect to database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hs9qs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// console.log(uri);

async function run() {
    try {
        await client.connect()

        const database = client.db('cars_fair')
        const carsCollection = database.collection('cars')
        const ordersCollection = database.collection('orders')
        const reviewsCollection = database.collection('reviews')

        // get all orders
        app.get('/cars', async (req, res) => {
            const cursor = carsCollection.find({})
            const result = await cursor.toArray()
            res.json(result)
        })

        // save orders info in database
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order)
            res.json(result)
        })

        // all orders get
        app.get('/orders', async (req, res) => {
            const cursor = ordersCollection.find({})
            const result = await cursor.toArray()
            res.json(result)
        })

        // cancel specific order
        app.delete('/orders/:id', async (req, res) => {
            const order = req.params.id
            const filter = { _id: ObjectId(order) }
            const result = await ordersCollection.deleteOne(filter)
            res.json(result)
            // console.log(order)
        })

        // specific user's orders
        app.get('/orders/:email', async (req, res) => {
            const email = req.params.email
            const filter = { email: email }
            const result = await ordersCollection.find(filter).toArray()
            res.json(result)
            // console.log(result)
        })

        // store review 
        app.post('/review', async (req, res) => {
            const review = req.body;
            const result = await reviewsCollection.insertOne(review)
            res.json(result)
        })

        // get all reviews
        app.get('/reviews', async (req, res) => {
            const result = await reviewsCollection.find({}).toArray()
            res.json(result)
        })

    }
    finally {
        // await client.close()
    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Hello car fair')
})

app.listen(port, () => {
    console.log('listening at the port', port)
})