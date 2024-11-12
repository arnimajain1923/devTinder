
const mongoose = require("mongoose");
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validation= require('../utils/validation');

// userSchema definition

const userSchema = new mongoose.Schema({
    firstName:{
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
        validate:{
            validator: function(value) {
                    // Validate the username using the Joi validation function
                    if (!value) return true;
                    if( !validation.validateUserName(value)){
                        throw new Error (
                            JSON.stringify({ 
                                "message": " ERROR : invalid credentials"
                        }));
                    }
            }
                
        }
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
                throw new Error (
                    JSON.stringify({ 
                        "message": " ERROR : invalid credentials"
                    }));
            }
        }
        
    },
    password:{
        type:String,
        required:true,
        minLength:8,
        maxLength:100,
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
            if(!["male","female","other"].includes(value)){
              throw new Error("Gender data is not valid");
            }
        }
    },
    avatar:{
        type:String,
        // required:true
        validate(value){
            if(!validator.isURL(value)){
                throw new Error ("enter a valid image url");
            }
        }
    },
    coverImage:{
        type:String,
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
                    const validationResult = validation.validateArray(skills, 5, 'skills');
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
                    const validationResult = validation.validateInterest(interestArray);
                    // let result = validationResult === true ? true : validationResult;
                    if(validationResult!==true){
                        throw new Error(validationResult);
                    }
                } catch (err) {
                    throw new Error(err.message);  //Re-throw the error so Mongoose handles it
                }

          },
            
         }
    },
    status:{
        type : String,
        default:"0"
    }
},
//timestamp for creation and updation of record
{
    timestamps: true,
   }
);

//create jwt token for user
userSchema.methods.getJWT = async function(){
//user representing current instance particularily
    const user = this;
//create a JWT token
const token = await jwt.sign({_id:user._id},"develop@js#node" , {expiresIn: "7d"});
return token;
}

//password verification for user login
userSchema.methods.PasswordVerification = async function(passwordInput){

    const user = this;
    const passwordHash= user.password;
const isPasswordValid = await bcrypt.compare(passwordInput, passwordHash);
return isPasswordValid ;
}

//using schema to create user model
const User=mongoose.model("User",userSchema);

module.exports= User;