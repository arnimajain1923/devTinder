const mongoose = require('mongoose'); 
require('dotenv').config();

//connecting to database using mongoose
const connectDB = async ()=>{
    await mongoose.connect(process.env.MONGODB_URI);
};

  module.exports = connectDB;


