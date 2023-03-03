const express = require("express");
const http = require("http");
const cors = require("cors");
const colors = require('colors');
const dotenv = require("dotenv")
dotenv.config()
const { router } = require("./api/router");
const app = express();
const PORT = 5000;
const server = http.createServer(app);
const { Server } = require("socket.io");
const corsOptions = {
    origin: process.env.CLIENT_IP || 'http://localhost:3000',
    methods: ["GET", "POST"]
}
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_IP || 'http://localhost:3000',
        methods: ["GET", "POST"]
    }
});
app.use(cors(corsOptions));
app.use(router)

io.on("connection", (socket) => {
    let name;
    let roomID;
    let entryNumber;
    let auth;
    console.log(process.env.CLIENT_IP);
    socket.on("join", (res) => {
        socket.name = res.name;
        socket.roomID = res.room;
        socket.join(res.room);
        socket.entryNumber = io.sockets.adapter.rooms.get(socket.roomID).size;
        if (socket.entryNumber === 1) {
            socket.auth = "admin";
        } else {
            socket.auth = "user";
        }
        console.log(
        "Room: ".green+socket.roomID +
        "\n Name: ".blue+socket.name + 
        "\n entryNumber: ".blue + socket.entryNumber + 
        "\n Auth: ".blue + socket.auth);
        
        io.to(res.room).emit("connected", {
            name: res.name
        })
    })
    socket.on("chat", (res) => {
        //console.log("Gidiyor");
        if (res.message !== "") {
            io.to(res.room).emit("chat", {
                name: res.name,
                message: res.message
            })
        }
    })
    socket.on("disconnect", () => {
        console.log("User Disconnected " + socket.name);
        //console.log(socket.to(room));
        io.to(socket.roomID).emit("disconnected", {
            name: socket.name
        })
    })
    socket.on("whisper", (res) => {
        console.log(res);
        console.log("WHISPER " + res.user + " === " + socket.name);
        console.log("Receive: " + socket.name);
        if (res.user !== socket.name) {
            io.emit(`whisper-${res.user}`, {
                name: res.sender,
                message: res.msg
            })
        }
        io.emit(`whisper-${res.sender}`, {
            name: res.sender,
            message: res.msg
        })

    })
})

server.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});

