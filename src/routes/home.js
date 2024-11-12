const express = require('express');
const { userAuth }= require("../middlewares/auth");
const Blog = require("../models/blogModel");
const User = require("../models/userModel")
const homeRouter = express.Router();

homeRouter.get("/home",userAuth , async (req, res)=>{
    try{
        const user = req.user
        
        const allUsers = await User.find({_id:{
            nin:[req.user._id]}
        })
    
    res.render("home",{
        user,
        firstName: user.firstName,
        users:allUsers
    })

    }catch(err){
        console.log(err);
        res.status(400).send(err.message);
    }
});

module.exports = homeRouter ;