
const mongoose = require("mongoose");
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
    emailId:{ 
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        maxLength:50,
    },
    password:{
        type:String,
        required:true,
        minLength:8,
        maxLength:50,
        
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
        default:"https://th.bing.com/th/id/OIP.sP_Fy-jUeB7gAQ9ovXho_wHaF7?w=212&h=180&c=7&r=0&o=5&pid=1.7"
    },
    about:{
        type:String,
        default:"Describe yourself",
        maxLength:300,
    },
    skills:{
        type:[String],
    },
    interest:{
        type:[String],
        validate(value){
           if(! [
            "coding partners" ,
            "networking ",
            "open-source",
            "learning",
            "mentorship",
            "side projects", 
            "job","freelance",
            "hackathons", 
            "code review",
            "dbms",
            "startup",
            "pair programming",
            "tech-trends", 
            "event",
            "other"
           ].includes(value)){
            throw new Error("The interest you mentioned is not appropriate");
            }
        
        }
    }
},
{
    timestamps: true,
   }
);

const User=mongoose.model("User",userSchema);

module.exports= User;