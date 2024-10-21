//starting point of appplication
//core application code

//imports
const express = require('express');
const connectDB = require("./config/database");
const User = require("./models/user");
const {validateUser} = require("./utils/validation");
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { userAuth }= require("./middlewares/auth");

const morgan = require('morgan');
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
//user signup api 
app.post("/signup",async(req,res)=>{

 try{
   
//validation of data

  validateUser(req);

 //encrypt the password
 const data = {firstName , lastName , username ,emailId , password , age , gender , photoUrl ,about , skills , interest
  } = req.body

 const passwordHash =await  bcrypt.hash(password , 10);
console.log(passwordHash);
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
app.post("/login",async(req,res)=>{
try{
    const{emailId , password}= req.body;

   const user = await User.findOne({emailId : emailId})  ;
if(!user){
    throw new Error(JSON.stringify({message:"ERROR!!! invalid credentials"}));
}
const isPasswordValid = await user.PasswordVerification(password);

if(!isPasswordValid){
    throw new Error(JSON.stringify({message:"ERROR!!! invalid credentials"}));
}
else{
    //create token from schema helper /util function
    const token = await user.getJWT();

    //  add the token to cookie and send the response back to user
    const cookies =  res.cookie("token",token ,{ maxAge: 30*24*60*60*1000, httpOnly: true  });
    //cookie expires in 30 days
    // console.log(token);
    console.log("user login succesfully!!");
   
    res.send(user);
}
}catch(err){
    console.log(err);
    res.status(400).send(err.message);
}
});

//profile api - get user profile only
app.get("/profile", userAuth ,async (req,res)=>{
    
    try
    {
        const user = req.user;
        if(!user){
            throw new Error(JSON.stringify({message:"ERROR!!! invalid user"}));
        }
        res.send(user);
    }catch(err){
        console.log(err);
        res.status(400).send(err.message);
    }

});

//send Request api
app.post("/sendRequest", userAuth , async(req,res)=>{
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