const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

//get all the pending requests for loggedin user
userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
  try {
    const loggedinUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedinUser._id,
      status: "interested",
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "profilePicture",
      "skills",
    ]);
    res.json({
      message: `Connection Requests of ${loggedinUser.firstName} fetched successfully`,
      data: connectionRequests,
    });
  } catch (err) {
    res.status(400).sned("ERROR: " + err.message);
  }
});

//get all the users who accepted
userRouter.get("/user/myconnections", userAuth, async (req, res) => {
  try {
    const loggedinUser = req.user;
    const myConnections = await ConnectionRequest.find({
      $or:[
        {toUserId:loggedinUser._id, status:"accepted"},
        {fromUserId:loggedinUser._id, status:"accepted"}
      ]
    }).populate("fromUserId", ["firstName", "lastName", "profilePicture"]).populate("toUserId", ["firstName", "lastName", "profilePicture"]);

    const data = myConnections.map((connection)=>{
        if(connection.fromUserId._id.toString() === loggedinUser._id.toString()){
            return connection.toUserId
        }
        return connection.fromUserId
    })

    res.json({
      message: "My Connections fetched successfully",
      data,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = userRouter;
