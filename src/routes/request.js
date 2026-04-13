const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth.js");
const ConnectionRequest = require("../models/connectionRequest.js");
const User = require("../models/user.js");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      
      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type: " + status });
      }

      if(fromUserId == toUserId){
        return res.status(400).json({message:"you can not send connection request to yourself"})
      }

      const toUser = await User.findById(toUserId);
      if(!toUser){
        return res.status(404).json({message:"user not found"})
      }


      //If there is an existing connection request, so sender will not able to resend the connection request and reciever is also not able to send the connection request to the sender
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or:[
          {fromUserId,toUserId,},
          {
            fromUserId:toUserId,
            toUserId:fromUserId
          }
        ]
      });
      if (existingConnectionRequest) {
        return res.status(400).json({
          message: "Connection request already exists",
        });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();
      res.json({
        message: (status == "interested")? `${req.user.firstName} is sending connection request to ${toUser.firstName}'s profile` : `${req.user.firstName} is ignoring ${toUser.firstName}'s profile`,
        data,
      });
    } catch (err) {
      res.status(404).send("ERROR: " + err.message);
    }
  },
);

module.exports = requestRouter;
