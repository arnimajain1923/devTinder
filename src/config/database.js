const mongoose = require('mongoose'); 

// const URL ="mongodb+srv://ArnimaJain:Arnima@1902@user-data.icewz.mongodb.net/";

//connecting to database using mongoose
const connectDB = async ()=>{
    await mongoose.connect("mongodb://localhost:27017/devTinder");
};


// const connectDB = async () => {
//     try {
//       const conn = await mongoose.connect("mongodb+srv://ArnimaJain:Arnima@1902@user-data.icewz.mongodb.net/devTinder");
    
//       console.log(`MongoDB Connected: ${conn.connection.host}`);
//     } catch (error) {
//       console.error(`Error: ${error.message}`);
//       process.exit(1);
//     }
//   };
  
  module.exports = connectDB;


