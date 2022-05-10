const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gukqi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
//user: Softzino
//pass: cnIfWWvDR9iCmOhS

async function run() {
  try {
    await client.connect();
    const database = client.db("Softzino");
    const users = database.collection("allRegisterUsers");

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
      res.json(cursor)
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
