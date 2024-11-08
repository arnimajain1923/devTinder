const express = require('express');
const User = require("../models/user");
const {validateUser} = require("../utils/validation");
const bcrypt = require('bcrypt');
const authRouter = express.Router();
//const uploadFile= require("../middlewares/multer.middleware");
const multer = require('multer');
const path = require('path');
const {uploadOnCloudinary} = require('../utils/cloudinary');
const { date } = require('joi');

const storage = multer.diskStorage({
    destination:function(req , file , cb){
        const location = path.join(__dirname, "../public/temp");
        return cb(null , location);
    },
    filename:function(req , file , cb){
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.originalname + '-' + uniqueSuffix)
    
    }
})
const uploadFile = multer({storage});

//route to display signup page
authRouter.get('/signup', (req, res) => {
    res.render('signup');
  });

//route to handle form submission
authRouter.post("/signup",
    uploadFile.fields([
        {
            name : "avatar",
            maxCount :1
        },
        {
             name: "coverImage",
             maxCount: 1  
        }
    ]),
    async(req,res)=>{

    try{
      
   //validation of data
   
     validateUser(req);
   
    //encrypt the password
    const{firstName , lastName , username ,emailId , password , age , gender , about , skills , interest
     } = req.body

     const avatarLocalPath = req.files?.avatar[0].path;
     const coverImageLocalPath = req.files?.coverImage ? req.files.coverImage[0].path : null;
     if(!avatarLocalPath){
        throw new Error(JSON.stringify({message:"ERROR!!! avatar required"}));
     };
     const avatar = await uploadOnCloudinary(avatarLocalPath);

    // console.log(coverImageLocalPath);
 
    let coverImageUrl = "";
     let coverImage ;
    if (coverImageLocalPath!==null) {
        coverImage = await uploadOnCloudinary(coverImageLocalPath);
        coverImageUrl = coverImage.url;
    }

    //  console.log("avatar",avatar);
    //  console.log("coverImage" , coverImage);
     if(!avatar){
        throw new Error(JSON.stringify({message:"ERROR!!! avatar required"}));
     }
    const passwordHash =await  bcrypt.hash(password , 10);
//    console.log(passwordHash);
       //save the data into users collection
       //creating a new instance of user model
       
       const user = new User({
           firstName :firstName.toLowerCase() ,
           lastName , 
           username :username.toLowerCase() ,
           emailId ,
           password:passwordHash , 
           age , 
           gender , 
           avatar: avatar.url? avatar.url :process.env.DEFAULT_AVATAR ,
           coverImage:coverImageUrl,
           about , 
           skills , 
           interest
           }
       );
   
       await user.save();
    //     console.log(user);
    //    console.log(req.file);
       res.render('home', { firstName });
    }catch(err){
       console.log(err);
       res.status(400).send(err.message);
    }


});


//route to display login page
authRouter.get('/login', (req, res) => {
    res.render('login');
  });
   
   //login api
authRouter.post("/login",async(req,res)=>{  
   try{
       const{emailId , password}= req.body;
   
      const user = await User.findOne({emailId : emailId})  ;
   if(!user){
       throw new Error(JSON.stringify({message:"ERROR!!! invalid credentials"}));
   }
   const isPasswordValid = await user.PasswordVerification(password);
   
   if(!isPasswordValid){
       throw new Error(JSON.stringify({message:"ERROR!!! invalid creds"}));
   }
   else{
       //create token from schema helper /util function
       const token = await user.getJWT();
   
       //  add the token to cookie and send the response back to user
        res.cookie("token",token ,{ maxAge: 24*60*60*1000, httpOnly: true  });
       //cookie expires in  1 day
       // console.log(token);
    //    console.log("user login succesfully!!");
      const firstName = user.firstName;
       res.render('home',{firstName});
   }
   }catch(err){
    //    console.log(err);
       res.status(400).send(err.message);
   }
   });

   //logout api
authRouter.post("/logout", async(req,res)=>{
    res.clearCookie("token").json({"message":"user logout successfully"});
});
module.exports = authRouter;