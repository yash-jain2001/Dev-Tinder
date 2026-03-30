const mongoose = require("mongoose")
const validator = require("validator")

const userSchema = new mongoose.Schema({
    firstName:{
       type: String,
       required:true,
       minLength:3,
       maxLength:30
    },
    lastName:{
        type:String,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error(" email is not valid " + value)
            }
        }
    },
    password:{
        type:String,
        required:true,
        minLength:8,
    },
    age:{
        type:Number,
        min:18,
        max:60 
    },
    gender:{
        type:String,
        validate(value){
            if(!["male", "female", "others"].includes(value)){
                throw new Error("gender must be male, female or others")
            }
        }
    },
    about:{
        type:String,
        default:"this is about section"
    },
    skills:{
        type: [String],
        max:10
       }
},
{timestamps:true});

const User = mongoose.model("User",userSchema);
module.exports = User;
