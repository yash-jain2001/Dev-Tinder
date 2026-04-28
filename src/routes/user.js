const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

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
    }).populate("fromUserId", ["firstName", "lastName", "profilePicture", "gender", "age", "skills", "email","about"]).populate("toUserId", ["firstName", "lastName", "profilePicture", "gender", "age", "skills", "profileDescription"]);

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

userRouter.get("/feed", userAuth, async(req,res)=>{
  try{
     const loggedinUser = req.user;

     const page = parseInt(req.query.page) || 1;
     let limit = parseInt(req.query.limit) || 10;
     limit = limit>50?50 : limit

     //find all connections requests (sent and recieved)
     const connectionRequests = await ConnectionRequest.find({
      $or:[{fromUserId: loggedinUser._id},{toUserId:loggedinUser._id}]
     }).select("fromUserId toUserId");

     const hideUsersFromFeed = new Set();
     connectionRequests.forEach((request)=>{
      hideUsersFromFeed.add(request.fromUserId.toString());
      hideUsersFromFeed.add(request.toUserId.toString()); 
     })

     const users = await User.find({
      $and:[
        {_id:{$nin: Array.from(hideUsersFromFeed)}},
        {_id:{$ne: loggedinUser._id}}
      ]
    }).select("firstName lastName age gender profilePicture skills about").skip((page-1)*limit).limit(limit)

res.send(users)
  }catch(err){
    res.status(400).send("ERROR: " + err.message)
  }
})

module.exports = userRouter;
