const express = require('express');
const { userAuth }= require("../middlewares/auth");
const connectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

const requestRouter = express.Router();
//send Request api
requestRouter.post("/send/request/:status/:UserId", userAuth , async(req,res)=>{
    try{    const{_id , firstName} = req.user;
            const FromUserId =_id;
            const ToUserId = req.params.UserId;
            const Status = req.params.status;

            console.log(FromUserId , ToUserId , Status);
            const allowedStatus = ["ignored","interested"];
            if(!allowedStatus.includes(Status)){
                return res.status(400).json({"message":"request is not valid"});
            };
            //$OR query - logical OR to find any existing request with same from and to user ids
            const existingRequestCheck = await connectionRequest.findOne({
                $or :[
                    {fromUserId :FromUserId , toUserId : ToUserId},
                    {fromUserId :ToUserId ,toUserId: FromUserId}
                ]
            });

            if(existingRequestCheck){
                return res.status(400).json({"message":"request already exist"});
            };

            const toUser = await User.findById(ToUserId);
            console.log(toUser);
        
            if(!toUser){
                return res.status(400).json({message:"ERROR!!! invalid user"});
            }
            const Request = new connectionRequest({
                fromUserId : FromUserId , 
                toUserId :ToUserId ,
                status :Status});
            await Request.save();
            console.log(Request);

            if(Status ==="interested"){
                res.json({message:`${firstName} is interested in ${toUser.firstName}`});
            }
            else{
                res.json({message:`${firstName} has ignored ${toUser.firstName}`});
            };
        }
    catch(err){
        console.log(err);
        res.status(400).json(err.message);
        };

    
});

requestRouter.post("/request/review/:status/:requestId", userAuth , async(req, res)=>{
    try{
        const{status , requestId}= req.params;
        const loggedInUser = req.user;
        //requestid check
        //logged in usercheck
        //existing request status check
        const allowedStatus =['accepted', 'rejected'];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({"message":"status invalid"});
        };

        const existingRequest = await connectionRequest.findOne({
            _id: requestId,
            toUserId :loggedInUser._id,
            status:"interested"
        });
        console.log(existingRequest);
        if(!existingRequest){
            return res.status(400).json({"message":"request does not exist"});
        };
        existingRequest.status = status ;
        const reviewedRequest = await existingRequest.save() ;
        console.log(reviewedRequest);
        res.json({"message":`requested ${status} succesfully`});
    }catch(err){
        res.json({"message":err.message});
    };
 
});

module.exports = requestRouter;