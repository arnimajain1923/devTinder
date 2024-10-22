const express = require('express');
const { userAuth }= require("../middlewares/auth");
const User = require("../models/user");
const bcrypt = require('bcrypt');
const profileRouter = express.Router();



//profile display api - get current user profile
profileRouter.get("/profile/view", userAuth ,async (req,res)=>{
    
    try
    {
        // req.user = let user;
        if(!req.user){
            throw new Error(JSON.stringify({message:"ERROR!!! invalid user"}));
        }
        res.send(req.user);
    }catch(err){
        res.status(400).send(err.message);
    }

});


 //profile edit api - edit user profile 
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        const Updates = Object.keys(req.body); // Get the keys from the request body
        const ALLOWED_UPDATES = [
            "photoUrl", "about", "gender", "interest", "skills", "password", "age"
        ];
        const filteredUpdates = Updates.filter(update => ALLOWED_UPDATES.includes(update));

        let user = req.user;
        console.log('User before update:', user);

        // Apply the allowed updates to the user object
        filteredUpdates.forEach(key => {
            user[key] = req.body[key];
        });

        await user.save();

        console.log('User after update:', user);

        // Respond with success
        res.send({"message": 'User updated successfully', "user": user});
    } catch (err) {
        // Log the error and respond with a proper status
        console.error('Error updating user:', err);
        res.status(400).send({error: err.message});
    }
});


//forgot password / change password api
profileRouter.patch("/profile/password/change", userAuth, async (req, res) =>{
    let {password , _id}= req.user;
    // let user = req.user;
    const{oldPassword , newPassword , confirmPassword} = req.body;
    const checkOldPassword  = bcrypt.compare(oldPassword ,password );
    console.log(password);
    try{
        if(checkOldPassword){
            if(newPassword===confirmPassword){
                const newPasswordHash =  await  bcrypt.hash(newPassword , 10);
                await User.findByIdAndUpdate(_id, { password: newPasswordHash}, { new: true });
            }
            else{
                throw new Error({"message":"ERROR!!! invalid user"});
            }
        };
        res.send({"message":"password changed succesfully"});
    }catch(err){
        res.status(400).send(err.message);
    }
});


//delete profile
profileRouter.delete("/profile/delete",userAuth,async(req,res)=>{
    
    try{
        
        const {_id} = req.user;
        const deleteUser = await User.findByIdAndDelete(_id);
        if(!deleteUser){
            throw new Error({"message":'invalid credentials'}); 
        }
        else{
            res.send({"message":"user deleted succesfully"});
        }
        
    }catch(err){
        res.status(400).send(
            ({message:"ERROR : "}) , err.message
        );
    }
});


module.exports = profileRouter;