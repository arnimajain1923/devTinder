const validator = require('validator');
const Joi = require('joi');
// const {validateUsername }= require('./userValidation');

const validateUser = (req)=>{
    const {firstName , username , emailId , password } = req.body ;
     //firstName and lastName validation
    if(!firstName){
        throw new Error(JSON.stringify({message:'ERROR : First Name is required'}));
    }
    else if(firstName.length<3 || firstName.length>50 ){
        throw new Error(JSON.stringify({message:'ERROR : invalid name'}));
    }

    //username validation 
    if(!username){
        throw new Error(JSON.stringify({message:'ERROR : username is required'}));
    }
    validateUserName(username);

     //email id validation
     if(!emailId){
        throw new Error(JSON.stringify({message:'ERROR : email Id is required'}));
    };
    if(!validator.isEmail(emailId)){
        throw new Error (
            JSON.stringify({ 
                "message": " ERROR : invalid email Id"
            }));
    };

//password validation

    if(!password){
        throw new Error(JSON.stringify({message:'ERROR : password is required'}));
    };

    if(!validator.isStrongPassword(password)){
        throw new Error (
            JSON.stringify({ 
                message: " ERROR : Enter a stronge password"
            }));
    };

};




//firstName and lastName validation function
const validateName =(req)=>{
    const {firstName , lastName 
     } = req.body ;
if(!firstName){
    throw new Error(JSON.stringify({message:'ERROR : First Name is required'}));
}
if(firstName.length<3 || firstName.length>50 || lastName.length>50){
    throw new Error(JSON.stringify({message:'ERROR : invalid name'}));
}
}

 //username validation function
const validateUserName =(username)=>{

    if(!username){
        throw new Error(JSON.stringify({message:'ERROR : username is required'}));
    }
    const usernameSchema = Joi.string().alphanum().min(8).max(25).required();
    const { error } = usernameSchema.validate(username);
    if (error) {
        throw new Error(JSON.stringify({message:'Username must be 8-25 characters long and contain only letters and numbers.'}));
    }

    return true;
    
}

 //email id validation function
const validateEmailId =(emailId)=>{
  

    if(!emailId){
        throw new Error(JSON.stringify({message:'ERROR : email Id is required'}));
    };
    if(!validator.isEmail(emailId)){
        throw new Error (
            JSON.stringify({ 
                "message": " ERROR : invalid email Id"
            }));
    };
};

//password validation function
const validatePassword =(password)=>{

    if(!password){
        throw new Error(JSON.stringify({"message":'ERROR : password is required'}));
    };

    if(!validator.isStrongPassword(password)){
        throw new Error (
            JSON.stringify({ 
                "message": " ERROR : Enter a stronge password"
            }));
    };
};

//gender validation function
const validateGender = (gender)=>{
    
    if(!gender){
        throw new Error(JSON.stringify({message:'ERROR : field is missing'}));
    };
    const Gender = ['male','female','other'];
    if(!Gender.includes(gender)){
        throw new Error (
            JSON.stringify({ 
                message: " ERROR : gender is not appropriate"
            }));
    };
}

//about validate
const validateAbout =(about)=>{
if(!about){
    throw new Error(JSON.stringify({message:'ERROR : about is empty'}));
}
if(about.length>300){
    throw new Error(JSON.stringify({message:'ERROR : maximum character limit reached'}));
}
}

//age validation
const validateAge =(age)=>{
    if(!age){
        throw new Error(JSON.stringify({message:'ERROR : age can not be empty'}));
    }
    if(age>18 || age>150){
        throw new Error(JSON.stringify({message:'ERROR : you are not allowed to use the app due to age restriction'}));
    }
}

//photoUrl validation
const validatePhotoUrl =(photoUrl)=>{
    if(!photoUrl){
        throw new Error(JSON.stringify({message:'ERROR : Image is required'}));
    }
    if(!validator.isURL(value)){
        throw new Error ("enter a valid image url");
    }
}
//array type fields validation for maximum elements and uniqueness
const validateArray = (array , maxLength ,fieldName)=>{
    let errors =[];
    if(array.length >maxLength){
        errors.push(`you can add maximum of ${maxLength} ${fieldName}`);
    };
    const uniqueItems = new Set(array);
    if (uniqueItems.size < array.length) {
        errors.push(`${fieldName} must be unique.`);
    }
    return errors.length === 0 ? true : errors ;
};

//validate interest field of schema
const validateInterest=(interestArray)=>{
    let errors = validateArray(interestArray,5,'interest');

    const validInterests = [
        "coding partners", "networking", "open-source", "learning", "mentorship",
        "side projects", "job", "freelance", "hackathons", "code review",
        "dbms", "startup", "pair programming", "tech-trends", "event", "other"
    ]

    interestArray.forEach(interest => {
            if(!validInterests.includes(interest)){
        errors.push(`The interest "${interest}" you mentioned is not appropriate`); 
        };
    });

    console.log(errors.length);
    if(errors.length>0){
        console.log(errors.length);
        throw new Error(JSON.stringify({message:errors.join(' , ')}));
    }
    return true;
};

module.exports={
    validateUser,
    validateName , 
    validateUserName , 
    validateEmailId,
    validatePassword,
    validateArray,
    validateInterest,
    validateGender,
    validateAbout,
    validateAge,
    validatePhotoUrl
};
