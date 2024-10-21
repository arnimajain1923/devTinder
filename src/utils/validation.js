const validator = require('validator');
const {validateUsername }= require('./userValidation');

const validateUser = (req)=>{
    const {firstName , lastName 
   , username , emailId , password } = req.body ;
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
    validateUsername(username);

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
const validateUserName =(req)=>{

    const { username  } = req.body ;
    if(!username){
        throw new Error(JSON.stringify({message:'ERROR : username is required'}));
    }
    validateUsername(username);
    
}

 //email id validation function
const validateEmailId =(req)=>{
  
    const {emailId } = req.body ;

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
const validatePassword =(req)=>{

    const {  password } = req.body ;
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

module.exports={
    validateUser,
    validateName , 
    validateUserName , 
    validateEmailId,
    validatePassword
};
