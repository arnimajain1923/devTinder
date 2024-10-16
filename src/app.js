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
    res.status(401).send("error saving the user!!!",err);
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