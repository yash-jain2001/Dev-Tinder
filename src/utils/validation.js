const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, email, password, age, gender, skills } =
    req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !age ||
    !gender ||
    !skills
  ) {
    throw new Error("All fields are required");
  }

  if (firstName.length < 3 || firstName.length > 30) {
    throw new Error("Invalid first name");
  }
  if (lastName.length < 3 || lastName.length > 30) {
    throw new Error("Invalid last name");
  }
  if (!validator.isEmail(email)) {
    throw new Error("Invalid Email");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error("Enter a strong password");
  }
  if (age < 18 || age >= 60) {
    throw new Error("your age doesnt suits to use Dev Tinder");
  }
  if(!["male","female","others"].includes(gender)){
    throw new Error("Invalid gender")
  }
  if(skills.length >10){
    throw new Error("skills should not be more than 10")
  }
  if(skills.length === 0){
    throw new Error("skills should not be empty")
  }
};

module.exports = validateSignUpData;
