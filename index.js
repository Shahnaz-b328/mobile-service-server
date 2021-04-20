const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(bodyParser.json())
const port = 5000

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tmexp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const servicesCollection = client.db("mobileRepair").collection("services");
  const ordersCollection = client.db("mobileRepair").collection("orders");
  const reviewInformation = client.db("mobileRepair").collection("review");
  const makeAdmin = client.db("mobileRepair").collection("admin");

  app.post('/addService', (req, res) => {
    const newService = req.body;
    console.log(newService)
    servicesCollection.insertOne(newService)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })
  app.post('/review', (req, res) => {
    const review = req.body;
    console.log(review)
    reviewInformation.insertOne(review)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })
  app.get('/reviewsData', (req, res) => {
    reviewInformation.find()
      .toArray((err, documents) => {
        res.send(documents)
      })
  })

  app.get('/services', (req, res) => {
    servicesCollection.find()
      .toArray((err, documents) => {
        res.send(documents)
      })
  })
  app.get('/services/:name', (req, res) => {
    servicesCollection.find({ name: req.params.name })
      .toArray((err, collection) => {
        res.send(collection[0])
      })

  })

  app.delete('/delete/:name', (req, res) => {
    servicesCollection.deleteOne({ name: (req.params.name) })
      .then(result => {
        res.send(result.deletedCount > 0);
      })
  })

  app.post('/addOrder', (req, res) => {
    order = req.body;
    ordersCollection.insertOne(order)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })

  app.get('/order', (req, res) => {
    ordersCollection.find()
      .toArray((err, documents) => {
        res.send(documents)
      })
  })

  app.post('/makeAdmin', (req, res) => {
    const admin = req.body;
    console.log(admin)
    makeAdmin.insertOne(admin)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })
  app.get('/admins', (req, res) => {
    makeAdmin.find()
      .toArray((err, documents) => {
        res.send(documents)
      })
  })
  app.post('/isAdmin', (req, res) => {
    const email = req.body.email;
    makeAdmin.find({ email: email })
      .toArray((err, admins) => {
        res.send(admins.length > 0);
      })
  })
  console.log('database connect successfully')
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port)