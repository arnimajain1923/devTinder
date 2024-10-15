const adminAuth =  (req, res , next)=>{
    const token = "345";
    const isAuthorized = token === "345";
    console.log("authentication is being done");
    if(isAuthorized){
        
        next();  
    }
    else{
        res.status(401).send("unauthorised , access denied");
    }
}

const userAuth =  (req, res , next)=>{
    const token = "345";
    const isAuthorized = token === "3456";
    console.log("authentication is being done");
    if(isAuthorized){
        
        next();  
    }
    else{
        res.status(401).send("unauthorised user, access denied");
    }
}

module.exports = {
    adminAuth,userAuth
};