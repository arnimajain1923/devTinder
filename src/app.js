//starting point of appplication
//core application code

//imports
const express = require('express');


//main server
const app = express();
//request handler function as arrow function
app.get("/test",
    (req,res,next)=>{
   
    //route handler function
    next();
    res.send("hello from server with get api request from first route handler");
    },
(req,res)=>{

    res.send("hello from server with get api request from second route handler");
});

app.listen(3000,()=>{
    console.log('server is running on port 3000');
});