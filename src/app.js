//starting point of appplication
//core application code

//imports
const express = require('express');


//main server
const app = express();
//request handler function as arrow function
app.get("/test",(req,res)=>{
    res.send("hello from server");
});

app.listen(3000,()=>{
    console.log('server is running on port 3000');
});