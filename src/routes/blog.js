const express = require('express');
const { userAuth }= require("../middlewares/auth");
const Blog = require("../models/blogModel");
const multer = require('multer');
const path = require('path');
const uploadOnCloudinary = require("../utils/cloudinary");
const blogRouter = express.Router();


const storage = multer.diskStorage({
    destination:function(req , file , cb){
        const location = path.join(__dirname, '../public/temp');
        return cb(null , location);
    },
    filename:function(req , file , cb){
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.originalname + '-' + uniqueSuffix)
    }
});


blogRouter.get('/blog/New' , userAuth,  (req, res)=>{
    return res.render("blog" , {
        user:req.user ,
        firstName : req.user.firstName
    })
});

blogRouter.post('/blog/New', userAuth, 
    multer({storage}).fields([
    {
        name : "blogImage",
        maxCount :1
    }
    ])
    ,async(req, res)=>
    {
    try{
        const user = req.user;
        let blogImageLocalPath ="";
        let  blogImage ;
        if(req.files?.blogImage){
            blogImageLocalPath = req.files?.blogImage[0].path;
            blogImage = await uploadOnCloudinary(blogImageLocalPath);
            console.log(blogImage);
        
        }
        //  blogImageLocalPath = req.files?.blogImage[0].path;
        // const blogImage = await uploadOnCloudinary(blogImageLocalPath);
        const blog = new Blog({
            title :req.body.title,
            body :req.body.body,
            blogImageUrl: blogImage.url ? blogImage.url :"",
            createdBy:user._id 
            }
        );
       const newBlog = await blog.save();
        // console.log(req.body);
        // console.log(req.file);
        return res.redirect(`/blog/${newBlog._id}`)
        }catch(err){
                console.log(err);
                res.status(400).send(err.message);
        }
});


module.exports = blogRouter ;