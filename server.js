const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gukqi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("Softzino");
    const users = database.collection("allRegisterUsers");
    const products = database.collection("products");
    const trainPassengerInfo = database.collection("trainPassengerInfo");

    //START Train Passenger information form task from here
    //---------->>>>>>>>>
    //post to database from client side  
    app.post("/passengers",async(req,res)=>{
      // console.log(req.body);
      const bodyData=req.body;
      const result = await trainPassengerInfo.insertOne(bodyData);
         res.json(result);
    })
     // get request from database for existing passenger search
    app.get("/passengers", async (req, res) => {
      const result = await trainPassengerInfo.find({}).toArray();
      res.json(result);
    });
    //<<<<<<<----------------------
    //End Code Train Passenger information form task






    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    //first Task Code from here
    //Get all products from database
    app.get("/products", async (req, res) => {
      const result = await products.find({}).toArray();
      res.json(result);
    });

    //add single product
    app.post("/products", async (req, res) => {
      const doc = req.body;
      const result = await products.insertOne(doc);
      res.json(result);
    });

    //remove single product
    app.delete("/products/:id", async (req, res) => {
      const selectProd = req.params.id;
      console.log(selectProd);
      const remove = { _id: ObjectId(selectProd) };
      const result = await products.deleteOne(remove);
      res.json(result);
    });
    app.get("/products/:id", async (req, res) => {
      // console.log(req.params.id);
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await products.findOne(query);
      res.json(result);
    });
    app.put("/products/:id", async (req, res) => {
      console.log(req.params.id);
    });
    //post to database newly register user
    app.post("/users", async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await users.insertOne(user);
      console.log(result);
      res.json(result);
    });

    //update operation fro users (Upsert)
    app.put("/users", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const option = { upsert: true };
      const updateDoc = { $set: user };
      const result = await users.updateOne(filter, updateDoc, option);
      res.json(result);
    });

    //Find all registered users from database

    app.get("/users", async (req, res) => {
      const query = {};
      const cursor = await users.find(query).toArray();
      res.json(cursor);
    });
  } finally {
    //   await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(port, () => {
  console.log("running server on port", port);
});
