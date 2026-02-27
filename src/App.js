const express = require("express");
const app = express();

app.get("/user/:id/:name/:pwd",(req, res)=>{
    console.log(req.params);
    res.send("get call from user")
})

app.use("/",(req, res)=>{
    res.send("response made from me ")
})




app.listen(3000,()=>{
    console.log("Server started on port 3000");
});