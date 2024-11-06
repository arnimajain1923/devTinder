//starting point of appplication
//core application code

//imports
require('dotenv').config();
const express = require('express');
const path = require("path");
const connectDB = require("./config/database");
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');
const morgan = require('morgan');
const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: false}));


app.set('views', path.join(__dirname, 'views'));
// set the view engine to ejs
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

//logger for development , debugging ,and console status of apis etc
app.use(morgan('dev'));

//user authentication routes
app.use("/" , authRouter);

//user profile related routes
app.use("/", profileRouter);

//send request router
app.use("/", requestRouter);

//get user requests and connections

app.use("/" , userRouter);




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




//connection to devTinder database
connectDB()
.then(()=>{
    console.log("database connection established");
    //listening application on port
    app.listen(port,()=>{
        console.log(`Server running on http://localhost:${port}`);
    }); 
})
.catch(err=>{
    console.log("database cannot connect" , err);
});