//starting point of appplication
//core application code

//imports
const express = require('express');
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();

app.use(express.json());
//user signup api 
app.post("/signup",async(req,res)=>{
    //creating a new instance of user model
    const user = new User(req.body);
 try{
    await user.save();
    res.send("user added succesfully");
 }catch(err){
    console.log(err);
    res.status(400).send(err);
 }
});

//feed API - get/feed - get all users from the databse
app.get("/feed",async(req,res)=>{
   
    try{
        const users = await User.find({});
        if(users.length===0){
          res.status(404).send("user not found");  
        }
        else{
            res.send(users);
        }
        
    }catch(err){
        console.log(err);
        res.status(400).send("something went wrong");
    }
});

//get user by id
app.get("/id",async(req,res)=>{
    const id = req.body._id;
  try{
        const user = await User.findById(id);
        if(!user){
            res.status(404).send("user not found")
        }
        else{
            res.send(user);
        }
    }catch(err){
        console.log(err);
        res.status(400).send("something went wrong");
    }
});

//get users by email id
app.get("/user",async(req,res)=>{
    const userEmail = req.body.emailId;
    try{
        
        const users = await User.find({emailId:userEmail});
        if(users.length===0){
          res.status(404).send("user not found");  
        }
        else{
            res.send(users);
        }
        
    }catch(err){
        console.log(err);
        res.status(400).send("something went wrong");
    }
});

//delete user by id

app.delete("/user",async(req,res)=>{
    const userId = req.body._id;
    try{
        
        const user = await User.findByIdAndDelete(userId);
        if(user.length===0){
          res.status(404).send("user does not exist");  
        }
        else{
            res.send("user deleted succesfully");
        }
        
    }catch(err){
        res.status(400).send("something went wrong");
    }
});

//update user by email
app.patch("/user/email",async(req,res)=>{

    const data = req.body;
    const userEmail = req.body.emailId;
    try{
        
        let user= await User.updateOne({emailId:userEmail},data,{
            runValidators:true,
        });
        if(user.length===0){
          res.status(404).send("user does not exist");  
        }
        else{
            console.log(user);
            res.send("user updated succesfully");
        }
        
    }catch(err){
        res.status(400).send("Update data failed" + err.message);
    }
});

//update user by id
app.patch("/user",async(req,res)=>{
    const data = req.body;
    const userId = req.body._id;
    try{
        
        const user = await User.findByIdAndUpdate(userId , data,{
            returnDocument:"after",
            runValidators:true,
        }); 
        if(user.length===0){
          res.status(404).send("user does not exist");  
        }
        else{
            console.log(user);
            res.send("user updated succesfully");
        }
        
    }catch(err){
        res.status(400).send("something went wrong");
    }
});


//connection to devTinder database
connectDB()
.then(()=>{
    console.log("database connection established");
    //listening application on port
    app.listen(3000,()=>{
        console.log('server is running on port 3000');
    }); 
})
.catch(err=>{
    console.log("database cannot connect" , err);
});