const jwt = require('jsonwebtoken');
const User = require("../models/userModel");
const userAuth = async (req, res , next)=>{
    try{
    //read the token from the req cookies 
    const {token} = req.cookies;
    if(!token){
        //console.log(req.cookies.token);
        throw new Error(JSON.stringify({message:"ERROR!!! invalid token"}));
    }
    const decodedObj = await jwt.verify(token ,"develop@js#node"  );

    //validate the token

    const{_id} = decodedObj;
    const user = await User.findById(_id);
    //console.log(user);

    if(!user){
        // console.log(user);
        res.redirect('/login');
        }
    else{
              req.user = user;
            //console.log(req.user);
            next();
            //move to request handler
        }
    }catch(err){
        console.log(err);
        res.status(400).send(err.message);
    }
};

module.exports = {
    userAuth
};