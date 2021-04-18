
const express = require("express");
const app = express();
const cors = require('cors');
const ObjectID = require("mongodb").ObjectID
app.use(cors());
app.use(express.json())
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.736kg.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const adminCollection = client.db(`${process.env.DB_NAME}`).collection("adminCollection");
  const OrderCollection = client.db(`${process.env.DB_NAME}`).collection("OrderList");
  const serviceCollection = client.db(`${process.env.DB_NAME}`).collection("servicesList");
  const ReviewCollection = client.db(`${process.env.DB_NAME}`).collection("Review");

  // add admin 
  app.post("/addAdmin", (req, res) => {
    const admin = req.body
    adminCollection.insertOne(admin)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  });

  // admin Check 

  app.post("/checkAdmin", (req, res) => {

    console.log(req.body.email)
    adminCollection.find({ email: req.body.email })
      .toArray((err, documents) => {
        res.send(documents)


      })





  });

  // add services
  app.post("/addServices", (req, res) => {
    serviceCollection.insertOne(req.body)
      .then(result => {
        res.send(result.insertedCount > 0)
      })

  });
  // PlaceOrder
  app.post("/placeOrder", (req, res) => {
    OrderCollection.insertOne(req.body)
      .then(result => {
        res.send(result.insertedCount > 0)
      })

  });
  app.post("/addServices", (req, res) => {
    serviceCollection.insertOne(req.body)
      .then(result => {
        res.send(result.insertedCount > 0)
      })

  });

  // get services

  app.get("/servicesList", (req, res) => {
    serviceCollection.find({})
      .toArray((err, collection) => {
        res.json(collection)
      })
  });



  // Find by ID 
  app.get("/order/services/:id", (req, res) => {

    serviceCollection.find({ _id: ObjectID(req.params.id) })
      .toArray((err, collection) => {
        res.send(collection[0])
      })

  });

  // find Order iteam  By user Email 

  app.get("/userBookingServices", (req, res) => {



    OrderCollection.find({ email: req.query.email })
      .toArray((err, documents) => {

        res.send(documents)

        console.log(err)

      })

  });

  // Delete iteam
  app.get("/deleteServices/:id", (req, res) => {

    serviceCollection.deleteOne({ _id: ObjectID(req.params.id) })
      .then(respons => {
        res.send(respons.deletedCount > 0)
      })
  });

  // Order list 

  app.get("/adminOrderList", (req, res) => {
    OrderCollection.find({})
      .toArray((err, collection) => {

        res.send(collection)

      })
  });

  // Update statues 

  app.patch("/update/status/:id", (req, res) => {

    OrderCollection.updateOne({ _id: ObjectID(req.params.id) },
      {
        $set: { status: req.body.update }
      }
    )
      .then(result => {
        res.send(result.modifiedCount > 0)
      })
  })

  // Add user review 
  app.post("/addReview", (req, res) => {
    ReviewCollection.insertOne(req.body)
      .then(result => {
        res.send(result.insertedCount > 0)
      })

  });
  // get review Data

  app.get("/getReview", (req, res) => {

    ReviewCollection.find({})
      .toArray((err, collection) => {
        res.send(collection)
      })

  });


});


module.exports = app


