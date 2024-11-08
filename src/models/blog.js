const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    title:{
        type : String ,
        required: true
    },
    blogImageUrl:{
        type: String ,
    },
    body:{
        type : String ,
        required: true
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref : "User"
    } 
    
},
{
    timestamps: true,
   }
)
const Blog = mongoose.model("blog",blogSchema);

module.exports= Blog;