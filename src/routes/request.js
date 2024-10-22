const express = require('express');
const { userAuth }= require("../middlewares/auth");
const requestRouter = express.Router();

//send Request api
requestRouter.post("/request/send", userAuth , async(req,res)=>{
    try{
         const user = req.user;
        if(!user){
            throw new Error(JSON.stringify({message:"ERROR!!! invalid user"}));
        }
        res.send(user.firstName +" sent a new connection request");
        }
    catch(err){
        console.log(err);
        res.status(400).send(err.message);
        }

    
})

module.exports = requestRouter;