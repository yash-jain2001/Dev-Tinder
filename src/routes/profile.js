const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth.js");
const { validateEditProfileData } = require("../utils/validation.js");

profileRouter.get("/profile/view", userAuth, (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.send("something went wrong " + err);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid edit request");
    }
    const loggedinUser = req.user;
    // console.log(loggedinUser);

    Object.keys(req.body).forEach((key) => {
      loggedinUser[key] = req.body[key];
    });
    await loggedinUser.save();
    // console.log(loggedinUser);
    res.json({message: `${loggedinUser.firstName}, Your profile updated successfully`, data: loggedinUser});
  } catch (err) {
    res.send("something went wrong " + err);
  }
});

module.exports = profileRouter;
