const express = require("express");
const connectDB = require("./config/database.js");
const User = require("./models/user");
const app = express();
const validateSignUpData = require("./utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(cookieParser());

// to post some data to the database
app.post("/signup", async (req, res) => {
  try {
    // console.log(req.body)
    const { firstName, lastName, email, password, age, gender, skills } =
      req.body;

    // validation of the data
    validateSignUpData(req);

    // encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);

    //creating a new instance of the User model
    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      age,
      gender,
      skills,
    }); // data is written in the postman to call a api, when called data is sent as request and recieved by server, then new instance is made and then saved to database
    await user.save();
    res.send("User created successfully");
  } catch (err) {
    console.log(err);
    res.send(`User not created, Error: ${err}`);
  }
});

//login Api
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const isEmailValid = validator.isEmail(email);
    if (!isEmailValid) {
      throw new Error("Invalid Email");
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("invalid credentials");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid || password.length < 8) {
      throw new Error("invalid credentials");
    } else {
      //create JWT token
      const token = jwt.sign({_id:user._id},"DevTinder@7370")

      // add token to cookie and send response back to user

      res.cookie("token", token)
      res.send("Login successful");
    }
  } catch (err) {
    res.send("Login failed ERROR: " + err.message);
  }
});

//profile API
app.get("/profile",async(req, res)=>{
  try{
const cookies  = req.cookies;
const {token} = cookies;
    //validate token
    if(!token){
      throw new Error("Invalid token");
    }
    const decodedMessage = jwt.verify(token,"DevTinder@7370");
    // console.log(decodedMessage);
    const {_id} = decodedMessage;
    // console.log("logged in user : "+ _id);
    const user = await User.findById(_id);
    if(!user){
      throw new Error("User not found");
    }
    res.send(user)
    // console.log(user.firstName+" "+user.lastName);
}
catch(err){
  res.send("something went wrong " + err);
}
})

// to get some data from the database, to get single user using emailid
app.get("/user", async (req, res) => {
  const userEmail = req.body.email;
  try {
    const user = await User.findOne({ email: userEmail });
    if (user.length === 0) {
      res.status(404).send("User not found");
    }
    res.status(200).send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send("User not found");
  }
});

// to get data from database, to get all users
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (error) {
    console.log(error);
    res.status(500).send("Users not found");
  }
});

//to delete data from DB
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("user deleted successfully");
  } catch (error) {
    console.log(error);
    res.send("user not deleted");
  }
});

// update data of user
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    // Add "userId" to allowedUpdates since it's being sent in the req.body
    const allowedUpdates = ["age", "gender", "about", "skills"];

    const isUpdateAllowed = Object.keys(data).every((key) =>
      allowedUpdates.includes(key),
    );
    if (!isUpdateAllowed) {
      throw new Error("Updates not allowed");
    }
    if (data.skills.length > 10) {
      throw new Error("Skills should not be more than 10");
    }
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      runValidators: true,
    });
    res.send("User updated successfully");
  } catch (err) {
    res.send("something went wrong " + err);
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
