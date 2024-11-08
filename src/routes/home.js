const express = require('express');
const { userAuth }= require("../middlewares/auth");
const Blog = require("../models/blog");

const homeRouter = express.Router();

homeRouter.get("/home",userAuth , async (req, res)=>{
    const user = req.user
    const allBlogs = await Blog.find({
        createdBy: user._id 
    });
    res.render("home",{
        user,
        blogs :allBlogs,
        firstName: user.firstName,
    })
});
module.exports = homeRouter ;