// import express from "express"
// import http from "http"
// import {Server} from "socket.io"


// const app = express()

// const server = http.createServer(app)

// //Create socket.iop server

// const io = new Server(server, {
//     cors : {
//         origin:"http://localhost:5173"
//     },
// })

// //Listen for connecitons

// io.on("connection", (socket)=>{
//     console.log("A user connected: ", socket.id);

//     socket.on("send-message", (data)=>{
//         console.log("message received from frontend", data);
//         io.emit("receive-message", data) //broadcast message toa ll connected clients

//     })

//     socket.on("disconnect", ()=>{
//         console.log("User disconnected: ", socket.id)
//     })
 
// })


// server.listen(5000, ()=>{
//     console.log("Server listening og port 5000")
// })