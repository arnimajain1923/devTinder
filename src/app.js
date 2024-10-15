//starting point of appplication
//core application code

//imports
const express = require('express');


//main server
const app = express();

const {adminAuth , userAuth}= require('./middlewares/auth');
//request handler function as arrow function
//handle auth for all http request get , post , delete etc 
//middleware for authentication
app.use("/admin" ,adminAuth);
app.get("/admin/getAllData",
    (req,res,next)=>{
   
    
    res.send("hello , this is the data");
    }
);
app.delete("/admin/delete",(req,res)=>{
    res.send("data deleted successfully");
});

app.get("/user/login",
    (req,res,next)=>{
   
    
    res.send("hello , this is the user");
    }
);
app.delete("/user/delete",userAuth,(req,res)=>{
    res.send("user deleted successfully");
});

app.listen(3000,()=>{
    console.log('server is running on port 3000');
});