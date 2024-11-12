const express = require('express');
const { userAuth }= require("../middlewares/auth");
const User = require("../models/userModel");
const bcrypt = require('bcrypt');
const { validatePassword,
    validateInterest,
    validateArray,
    validateGender,
    validateAbout,
    validateAge,
validatePhotoUrl} = require('../utils/validation');
const {} = require('../utils/userValidation');
const profileRouter = express.Router();



//profile display api - get current user profile
profileRouter.get("/profile/view", userAuth ,async (req,res)=>{
    
    try
    {
        // req.user = let user;
        if(!req.user){
            throw new Error.json({"message":"ERROR!!! invalid user"});
        }
        res.json(req.user);
    }catch(err){
        res.status(400).json(err.message);
    }

});


 //profile edit api - edit user profile 
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        const Updates = Object.keys(req.body); // Get the keys from the request body
        const ALLOWED_UPDATES = [
            "photoUrl", "about", "gender", "interest", "skills", "age"
        ];
        //validation for each field during update at api level
        if(Updates.includes('photoUrl')){
            validatePhotoUrl(req.body.photoUrl);
        };
        if(Updates.includes('about')){
            validateAbout(req.body.about);
        };
        if(Updates.includes('gender')){
            validateGender(req.body.gender);
        };
        if(Updates.includes('interest')){
            validateInterest(req.body.interest);
        };
        if(Updates.includes('skills')){
            validateArray(req.body.skills ,5, 'skills');
        };
        if(Updates.includes('age')){
            validateAge(req.body.age);
        };
        const filteredUpdates = Updates.filter(update => ALLOWED_UPDATES.includes(update));
        let user = req.user;
        // console.log('User before update:', user);
        // Apply the allowed updates to the user object

        filteredUpdates.forEach(key => {
            user[key] = req.body[key];
        });
        await user.save();
        // console.log('User after update:', user);

        res.json({"message": 'User updated successfully', "user": user});
    } catch (err) {
        // console.error('Error updating user:', err);
        res.status(400).json({error: err.message});
    }
});


//forgot password / change password api
profileRouter.patch("/profile/password/change", userAuth, async (req, res) =>{
    let {password , _id}= req.user;
    // let user = req.user;
    const{oldPassword , newPassword , confirmPassword} = req.body;
    const checkOldPassword  =await bcrypt.compare(oldPassword , password );
    try{
        if(checkOldPassword){
            if(newPassword!==confirmPassword){
                throw new Error(JSON.stringify({"message":"ERROR!!! newPassword and confirmPassword does not match . Try again !!!"}));
            }
            validatePassword(newPassword);
            const newPasswordHash =  await  bcrypt.hash(newPassword , 10);
            const user = await User.findByIdAndUpdate(_id, { password: newPasswordHash},{returnDocument:'after'});
            // console.log(user);
        }else{
            throw new Error(JSON.stringify({"message":"ERROR!!! invalid user"}));
        }
       
        res.json({"message":"password changed succesfully"});
    }catch(err){
        res.status(400).send(err.message);
    }
});


//delete profile
profileRouter.delete("/profile/delete",userAuth,async(req,res)=>{
    
    try{
        
        const {_id , password} = req.user;
        const{enterPassword} = req.body;
        if(!enterPassword){
            throw new Error(JSON.stringify({"message":'please enterPassword to confirm delete!!'}))
        }
        const checkPassword  =await bcrypt.compare(enterPassword , password );
        if(checkPassword){
        const deleteUser = await User.findByIdAndDelete(_id);
        if(!deleteUser){
            throw new Error(JSON.stringify({"message":'invalid credentials'})); 
        }
        else{
            res.json({"message":"user deleted succesfully"});
        };
        }else{
            throw new Error(JSON.stringify({"message":'invalid credentials'}));
        }
        
    }catch(err){
        res.status(400).send( err.message);
    }
});


module.exports = profileRouter;