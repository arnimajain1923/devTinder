
const mongoose = require("mongoose");
const validator = require('validator');
const joi = require('joi');
const userValidation= require('../validations/userValidation');
const userSchema = new mongoose.Schema(
    {
    firstName :{
        type: String,
        required:true,
        trim:true,
        maxLength:50,
    },
    lastName:{
        type:String,
        maxLength:50,
    },
    username:{
        type:String,
        required:true,
        unique:true,
        validate: {
            validator: function (username) {
                try {
                    // Validate the username using the Joi validation function
                    return userValidation.validateUsername(username);
                } catch (error) {
                    // Return false if the username is invalid
                    return false;
                }
            },
            message: 'Invalid username. It must be 8-25 characters long and contain only letters and numbers.',
        },
    
    },
    emailId:{ 
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        maxLength:50,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error ("enter a valid email");
            }
        }
        
    },
    password:{
        type:String,
        required:true,
        minLength:8,
        maxLength:50,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error ("Enter a strong password");
            }
        }

    },

    age:{
        type:Number,
        min: 18,
        max:150,
    },
    gender:{
        type:String,
        validate(value){
            if(!["male","female","others"].includes(value)){
              throw new Error("Gender data is not valid");
            }
        }
    },
    photoUrl:{
        type:String,
        default:"https://th.bing.com/th/id/OIP.sP_Fy-jUeB7gAQ9ovXho_wHaF7?w=212&h=180&c=7&r=0&o=5&pid=1.7",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error ("enter a valid image url");
            }
        }
    },
    about:{
        type:String,
        default:"Describe yourself",
        maxLength:300,
    },
    skills:{
        type:[String],
         validate:{ 
            validator: function(skills){
                try {
                    const validationResult = userValidation.validateArray(skills, 5, 'skills');
                    let result = validationResult === true ? true : validationResult;
                    if(result!==true){
                        throw new Error(validationResult);
                    }
                } catch (errors) {
                    throw new Error(errors.message);  //Re-throw the error so Mongoose handles it
                }
            },
        message :(props) => props.value.join(', '),
        },
    },
    interest:{
        type:[String],
        validate:{
            validator: function(interestArray){
                try {
                    const validationResult = userValidation.validateInterest(interestArray);
                    // let result = validationResult === true ? true : validationResult;
                    if(validationResult!==true){
                        throw new Error(validationResult);
                    }
                } catch (err) {
                    throw new Error(err.message);  //Re-throw the error so Mongoose handles it
                }

          },
            
         }
    }
},
{
    timestamps: true,
   }
);


const User=mongoose.model("User",userSchema);

module.exports= User;