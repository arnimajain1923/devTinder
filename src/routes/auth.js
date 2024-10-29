const express = require('express');
const User = require("../models/user");
const {validateUser} = require("../utils/validation");
const bcrypt = require('bcrypt');


const authRouter = express.Router();

//user signup api 
authRouter.post("/signup",async(req,res)=>{

    try{
      
   //validation of data
   
     validateUser(req);
   
    //encrypt the password
    const data = {firstName , lastName , username ,emailId , password , age , gender , photoUrl ,about , skills , interest
     } = req.body
   
    const passwordHash =await  bcrypt.hash(password , 10);
//    console.log(passwordHash);
       //save the data into users collection
       //creating a new instance of user model
       
       const user = new User({
           firstName ,
           lastName , 
           username ,
           emailId ,
           password:passwordHash , 
           age , 
           gender , 
           photoUrl ,
           about , 
           skills , 
           interest
           }
       );
   
       await user.save();
       res.send(JSON.stringify({message:'user added succesfully'}));
    }catch(err){
       console.log(err);
       res.status(400).send(err.message);
    }
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
       const cookies =  res.cookie("token",token ,{ maxAge: 24*60*60*1000, httpOnly: true  });
       //cookie expires in  1 day
       // console.log(token);
    //    console.log("user login succesfully!!");
      
       res.json(user);
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