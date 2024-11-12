const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    sender_id:{
        type : mongoose.Types.ObjectId ,
        required: true,
        ref: "User"
    },
    receiver_id:{
        type : mongoose.Types.ObjectId ,
        required: true,
        ref: "User"
    },

    message:{
        type : String ,
        required: true
    },
    client_offset: {
        type: String, 
        unique: true 
},
    
},
{
    timestamps: true,
   }
)
const Chat = mongoose.model("chat",chatSchema);

module.exports= Chat ;