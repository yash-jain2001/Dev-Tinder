const express = require("express");
const connectDB = require("./config/database.js");
const User = require("./models/user");
const app = express();


app.use(express.json());


// to post some data to the database
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


// to get some data from the database, to get single user using emailid
app.get("/user",async (req, res)=>{
const userEmail = req.body.email;
try{
  const user = await User.findOne({email:userEmail})
  if(user.length===0){
    res.status(404).send("User not found");
  }
  res.status(200).send(user);
}catch(err){
  console.log(err);
  res.status(500).send("User not found");
}
});

// to get data from database, to get all users
app.get("/feed",async (req,res)=>{
  try {
    const users = await User.find({})
    res.status(200).send(users);
  } catch (error) {
    console.log(error);
    res.status(500).send("Users not found");
  }
})

//to delete data from DB
app.delete("/user", async(req,res)=>{
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId)
    res.send("user deleted successfully") 
  } catch (error) {
    console.log(error);
    res.send("user not deleted")
  }
})




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
