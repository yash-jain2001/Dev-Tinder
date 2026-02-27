const express = require("express");
const app = express();

app.get("/user",(req, res)=>{
    res.send("get call from user")
})

app.post("/user",(req, res)=>{
    res.send("post call from user")
})

app.put("/user",(req, res)=>{
    res.send("put call from user")
})

app.delete("/user",(req, res)=>{
    res.send("delete call from user")
})

app.use("/",(req, res)=>{
    res.send("response made from me ")
})




app.listen(3000,()=>{
    console.log("Server started on port 3000");
});