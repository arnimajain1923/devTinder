const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequestModel');
const User = require('../models/userModel');

const userRouter = express.Router();
const VISIBLE_DATA ='firstName  lastName  photoUrl  age  gender  about skills  interest';




userRouter.get("/user/requests/pending" , userAuth ,async (req,res)=>{
    try{
        const loggedInUser = req.user;
        const ConnectionRequests = await ConnectionRequest.find({
            toUserId : loggedInUser._id,
            status : "interested"
        })
        .populate({
            path: 'toUserId',
            select: VISIBLE_DATA
        });
       
    res.json({
            message :"data fetched succesfully",
            data: ConnectionRequests
        });
    }
    catch(err){
        res.status(400).send(JSON.stringify({"message":err.message}))
    }
});


userRouter.get("/user/connections" , userAuth , async(req,res)=>{
    try{
        const loggedInUser = req.user;
        const connections = await ConnectionRequest.find({
            $or:[
                {fromUserId: loggedInUser._id , status : "accepted"},
                {toUserId: loggedInUser._id , status : "accepted"}
            ]
        }).populate("toUserId" ,VISIBLE_DATA )
          .populate("fromUserId" ,VISIBLE_DATA );
        // console.log(connections);
        const data =  connections.map((data) => {
            if(data.fromUserId.toString()===loggedInUser._id.toString()){
                return data.toUserId;
            }
            else{
                
                return data.fromUserId;
            }
       });
        // console.log(data);
        res.json(data);
            
    }catch(err){
        res.status(400).json(`message : ${err.message}`);
    }

});

//feed API - get/feed - get all users from the databse
userRouter.get("/user/feed", userAuth,async(req,res)=>{
    try{
        const loggedInUser = req.user;
        const page = req.query.page||1;
        let limit = req.query.limit||10 ;
        let skip = (page-1)*limit;
        //to check if user send unual limit to access record
        limit = limit>30?30:limit ;
        const connectionRequest = await ConnectionRequest.find({
          $or:[
            {fromUserId : loggedInUser._id} ,
            {toUserId : loggedInUser._id}
          ]
        }).select("fromUserId , toUserId");
        const hiddenUser = new Set();
        connectionRequest.forEach((req) => {
            hiddenUser.add(req.fromUserId.toString());
            hiddenUser.add(req.toUserId.toString());
        });
        hiddenUser.add(loggedInUser._id.toString());
        console.log(hiddenUser);
        const users = await User.find({
            _id:{$nin : Array.from(hiddenUser)}
        }).select(VISIBLE_DATA).skip(skip).limit(limit);
        console.log(users);
        console.log("User feed retrieval successful");
        res.json({
            message: "User feed retrieved successfully",
            data: users
        });
    }catch(err){
        console.log(err);
        res.status(400).json({ 'ERROR' : err.message});
    }
});
module.exports = userRouter ;