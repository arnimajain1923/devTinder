const express = require('express');
const { userAuth }= require("../middlewares/auth");
const profileRouter = express.Router();


//profile api - get current user profile
profileRouter.get("/profile", userAuth ,async (req,res)=>{
    
    try
    {
        // req.user = let user;
        if(!req.user){
            throw new Error(JSON.stringify({message:"ERROR!!! invalid user"}));
        }
        res.send(req.user);
    }catch(err){
        console.log(err);
        res.status(400).send(err.message);
    }

});

module.exports = profileRouter;