const express = require("express");
const connectDB = require("./config/database.js");
const User = require("./models/user");
const app = express();


app.use(express.json());
app.post("/signup", async (req, res) => {
// console.log(req.body)
  //creating a new instance of the User model
  const user = new User(req.body);      // data is written in the postman to call a api, when called data is sent as request and recieved by server, then new instance is made and then saved to database

  try {
    await user.save();
    res.send("User created successfully");
  } catch (err) {
    console.log(err);
    res.send("User not created");
  }
});

connectDB()
  .then(() => {
    console.log("Database connected");
    app.listen(3000, () => {
      console.log("Server started on port 3000");
    });
  })
  .catch((err) => {
    console.log("db not connected", err);
  });
