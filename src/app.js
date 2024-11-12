//starting point of appplication
//core application code

//imports
require("dotenv").config();
const express = require("express");
const path = require("path");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const Chat = require("./models/chatModel");
const { userAuth } = require("./middlewares/auth");
const cors = require('cors');



//routes
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const blogRouter = require("./routes/blog");
const homeRouter = require("./routes/home");

const app = express();
const server = createServer(app);
const io = new Server(server, {
  connectionStateRecovery: {},
});
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(morgan("dev"));
app.use(cors({
  origin: 'http://localhost:3001'
}));

// Route Handlers

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", blogRouter);
app.use("/", homeRouter);

app.get("/message", userAuth, (req, res) => {
  res.render("index", {
    user: req.user,
  });
});

// Socket.IO Connection Handler
io.on("connection", async (socket) => {

  // Listen for 'chat message' events with senderId and receiverId
  socket.on(
    "chat message",
    async (message, client_offset, sender_id, receiver_id, callback) => {
      try {
        if (!sender_id || !receiver_id || !message) {
          console.error("Missing required fields: sender_id, receiver_id, or message");
        }
        
        // Save the message to the database
        const chat = new Chat({
          message: message,
          client_offset: client_offset,
          sender_id: sender_id,
          receiver_id: receiver_id,
        });
        // console.log(chat);
        const result = await chat.save();
        // console.log(result);
        // Emit the message to all connected clients
        io.emit("chat message", message, result._id, sender_id, receiver_id);
        // Only call callback if it's a function
      if (typeof callback === 'function') {
        callback(); // Acknowledge the message was received and saved
      } // Acknowledge the message was received and saved
      } catch (error) {
        console.error("Error saving message:", error);
        if (typeof callback === 'function') {
          callback({ error: "Failed to save message" });
        }
      }
    }
  );

  // Handle message recovery for new clients
  if (!socket.recovered) {
    try {
      // Fetch messages where receiverId is the connected user
      const server_offset =
        socket.handshake.auth.server_Offset || "000000000000000000000000";
      const receiver_id = socket.handshake.auth.receiver_id;
      const chats = await Chat.find({
        _id: { $gt: server_offset },
        receiver_id: receiver_id,
      });

      chats.forEach((chat) => {
        socket.emit(
          "chat message",
          chat.message,
          chat._id,
          chat.sender_id,
          chat.receiver_id
        );
      });
    } catch (err) {
      console.error("Error fetching messages:", error);
    }
  }
});

// Catch-all route to handle undefined routes
app.get("*", function () {
  res.redirect("/login");
});

// //get user by id
// app.get("/user/:id",userAuth,async(req,res)=>{
//     const id = req.params?.id;
//   try{
//         const user = await User.findById(id);
//         if(!user){
//             throw new Error(JSON.stringify({message:'ERROR :invalid credentials'}));
//         }
//         else{
//             res.send(user);
//         }
//     }catch(err){
//         console.log(err);
//         res.status(400).send(err.message);
//     }
// });

// //get users by email id
// app.get("/user",userAuth,async(req,res)=>{
//     const userEmail = req.body.emailId;
//     try{

//         const users = await User.find({emailId:userEmail});
//         if(users.length===0){
//             throw new Error(JSON.stringify({message:'ERROR :invalid credentials'}));
//         }
//         else{
//             res.send(users);
//         }

//     }catch(err){
//         console.log(err);
//         res.status(400).send(  err.message);
//     }
// });

//connection to devTinder database
connectDB()
  .then(() => {
    console.log("database connection established");
    //listening application on port
    server.listen(port, () => { 
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log("database cannot connect", err);
  });
