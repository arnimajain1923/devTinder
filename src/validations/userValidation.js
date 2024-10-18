
const Joi = require('joi');




// Validation function using Joi for username
const validateUsername = (username) => {
    // Define Joi validation for the username field
    const usernameSchema = Joi.string().alphanum().min(8).max(25).required();
    const { error } = usernameSchema.validate(username);
    if (error) {
        throw new Error('Username must be 8-25 characters long and contain only letters and numbers.');
    }

    return true;
};

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
        throw new Error(errors.join(' '));
    }
    return true;
};

module.exports ={validateUsername,validateArray,validateInterest};