const { required, string } = require('joi');
const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    
    fromUserId :{
        type: mongoose.Schema.Types.ObjectId,
        required:[true, 'fromUserId is required'],
    },
    toUserId :{
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'toUserId is required'],
    },
    status :{
        type: String,
        required: [true, 'status is required'],
        enum:{
            values:["ignored","interested","accepted","rejected"],
            message:  '{VALUE} is inconsistent'
        }
    },
},
{timestamps:true}
);

connectionRequestSchema.index({fromUserId:1},{toUserId : 1});
connectionRequestSchema.pre("save", function (next){
   const connectionRequest = this;
   
    if(connectionRequest.fromUserId.equals(this.toUserId))
        {
            return next(new Error("ERROR!!! sending connection request to yourself"));
    }
    next();
})

const ConnectionRequestModel = new mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = ConnectionRequestModel;
