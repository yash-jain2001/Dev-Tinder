const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 30,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error(" email is not valid " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
    },
    age: {
      type: Number,
      min: 18,
      max: 60,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("gender must be male, female or others");
        }
      },
    },
    about: {
      type: String,
      default: "this is about section",
    },
    skills: {
      type: [String],
      max: 10,
    },
  },
  { timestamps: true },
);

userSchema.methods.getJWT =async function(){
    const user = this;
    const token = await  jwt.sign({_id:user._id},"DevTinder@7370",{expiresIn:"1d"});
    return token;
}

userSchema.methods.validatepassword = async function(password){
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(password,passwordHash);
    return isPasswordValid;
}

const User = mongoose.model("User", userSchema);
module.exports = User;
