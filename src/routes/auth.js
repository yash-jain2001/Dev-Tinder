const express = require("express");
const authRouter = express.Router();
const validateSignUpData = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");

authRouter.post("/signup", async (req, res) => {
  try {
    // console.log(req.body)
    const { firstName, lastName, email, password, age, gender, skills } =
      req.body;

    // validation of the data
    validateSignUpData(req);

    // encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);
    // console.log(passwordHash);

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

authRouter.post("/login", async (req, res) => {
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
    const isPasswordValid = await user.validatepassword(password);
    if (!isPasswordValid || password.length < 8) {
      throw new Error("invalid credentials");
    } else {
      //create JWT token
      const token = await user.getJWT();

      // add token to cookie and send response back to user

      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send(user);
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now())
  });
  res.send("Logout successfully");
});

module.exports = authRouter;
