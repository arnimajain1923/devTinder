const mongoose = require('mongoose'); 


//connecting to database using mongoose
const connectDB = async ()=>{
    await mongoose.connect("mongodb+srv://ArnimaJain:Arnima%401902@user-data.icewz.mongodb.net/devTinder");
};

  module.exports = connectDB;


