const jwt = require('jsonwebtoken');
const User = require("../models/user");
const userAuth = async (req, res , next)=>{
    try{
    //read the token from the req cookies 
    const {token} = req.cookies;
    if(!token){
        throw new Error(JSON.stringify({message:"ERROR!!! invalid token"}));
    }
    const decodedObj = await jwt.verify(token ,"develop@js#node"  );

    //validate the token

    const{_id} = decodedObj;
    const user = await User.findById(_id);

    if(!user){
        throw new Error(JSON.stringify({message:"ERROR!!! invalid credentials"}));
        }
    else{
            req.user = user;
            next();
            //move to request handler
        }
    }catch(err){
        console.log(err);
        res.status(400).send(err.message);
    }
}

module.exports = {
    userAuth
};