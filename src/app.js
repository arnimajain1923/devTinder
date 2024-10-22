//starting point of appplication
//core application code

//imports
const express = require('express');
const connectDB = require("./config/database");
const cookieParser = require('cookie-parser');
// const jwt = require('jsonwebtoken');
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const morgan = require('morgan');
const app = express();

app.use(express.json());
app.use(cookieParser());

//logger for development , debugging ,and console status of apis etc
app.use(morgan('dev'));

//user authentication routes
app.use("/" , authRouter);

//user profile related routes
app.use("/", profileRouter);


//send request router
app.use("/", requestRouter);


// //feed API - get/feed - get all users from the databse
// app.get("/feed", userAuth,async(req,res)=>{
   
//     try{
//         const users = await User.find({});
//         if(users.length===0){
//             throw new Error(JSON.stringify({message:'ERROR :users does not exist'}));
//         }
//         else{
//             res.send(users);
//         }
        
//     }catch(err){
//         console.log(err);
//         res.status(400).send(err.message);
//     }
// });

// //get user by id
// app.get("/user/:id",userAuth,async(req,res)=>{
//     const id = req.params?.id;
//   try{
//         const user = await User.findById(id);
//         if(!user){
//             throw new Error(JSON.stringify({message:'ERROR :invalid credentials'})); 
//         }
//         else{
//             res.send(user);
//         }
//     }catch(err){
//         console.log(err);
//         res.status(400).send(err.message);
//     }
// });

// //get users by email id
// app.get("/user",userAuth,async(req,res)=>{
//     const userEmail = req.body.emailId;
//     try{
        
//         const users = await User.find({emailId:userEmail});
//         if(users.length===0){
//             throw new Error(JSON.stringify({message:'ERROR :invalid credentials'}));  
//         }
//         else{
//             res.send(users);
//         }
        
//     }catch(err){
//         console.log(err);
//         res.status(400).send(  err.message);
//     }
// });

// //delete user by id
// //edit this function correctly for showing custom message for incorrect id
// app.delete("/user",userAuth,async(req,res)=>{
//     const userId = req.body._id;
//     try{
        
//         const user = await User.findByIdAndDelete(userId);
//         if(!user){
//             throw new Error(JSON.stringify({message:'invalid credentials'})); 
//         }
//         else{
//             res.send(JSON.stringify({message:"user deleted succesfully"}));
//         }
        
//     }catch(err){
//         res.status(400).send(
//             JSON.stringify({message:"ERROR : "}) + err.message
//         );
//     }
// });

// //update user by email
// // app.patch("/user/email",userAuth,async(req,res)=>{

// //     const data = req.body;
// //     const userEmail = req.body.emailId;
// //     try{
        
// //         let user= await User.updateOne({emailId:userEmail},data,{
// //             runValidators:true,
// //         });
// //         if(user.length===0){
// //             throw new Error(JSON.stringify({message:'invalid credentials'}));
// //         }
// //         else{
// //             console.log(user);
// //             res.send(JSON.stringify({message:'user updated succesfully'}));
            
// //         }
        
// //     }catch(err){
// //         res.status(400).send(JSON.stringify({message:'user updation failed'}) + err.message);
// //     }
// // });

// //update user by id
// app.patch("/user/:userId",userAuth,async(req,res)=>{
//     // const data = req.body;
//     const userId = req.params?.userId;
//     const {photoUrl , about , gender , interest , skills , password , age} = req.body    
//     try{
//         // const ALLOWED_UPDATES =[
//         //  "photoUrl","about","gender","interest","skills","password","age"
//         // ];
//         // const isUpdateAllowed = Object.keys(data).every((k)=>ALLOWED_UPDATES.includes(k));
//         // if(!isUpdateAllowed){
//         //     throw new Error(JSON.stringify({message:'update not allowed'}));
//         // }
//         // else{
//         //now code will not show error for extra unwanted fields but ignore them
//         //thus making app user friendly
//             const passwordHash =await  bcrypt.hash(password , 10);
//             const user = await User.findByIdAndUpdate 
//         ({_id : userId } ,
//              {
//                 photoUrl : photoUrl ,
//                 about: about ,
//                 gender: gender ,
//                 interest: interest , 
//                 skills: skills ,
//                 password : passwordHash, 
//                 age: age  
//              },
//              {
//             returnDocument:"after",
//             runValidators:true,
//         }); 
       
//         // console.log(user);
//         if(!user){
//             throw new Error(JSON.stringify({message:'invalid credentials'}));
//         }
//         else{
//             res.send(JSON.stringify({message:'user updated succesfully'}));
//         }   
//     }catch(err){
//         res.status(400).send(err.message);
//     }
// });


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