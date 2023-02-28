const express = require("express");
const http = require("http");
const cors = require("cors")
const {router} = require("./api/router");
const app = express();
const PORT = 5000;
const server = http.createServer(app);
const {Server} = require("socket.io");
const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ["GET","POST"]
}
const io = new Server(server,{
    cors: {
        origin: 'http://localhost:3000',
        methods: ["GET", "POST"]
    }
});
app.use(cors(corsOptions));
app.use(router)

io.on("connection", (socket) => {
    let name;
    let room;
    console.log("User was connected");
    socket.on("join", (res) => {
        console.log(res);
        socket.name = res.name;
        socket.room = res.room;
        console.log(socket.name + " " + socket.room);
        socket.join(res.room);
        io.to(res.room).emit("connected", {
            name: res.name
        })
    })
    socket.on("chat", (res) => {
        console.log("Gidiyor");
        if (res.message !== "") {
            io.to(res.room).emit("chat", {
                name: res.name,
                message: res.message
            })
        }
    })
    socket.on("disconnect", () => {
        console.log("User Disconnected "+socket.name);
        io.to(socket.room).emit("disconnected", {
            name: socket.name
        })
    })
    socket.on("sex", (res) => {
        console.log(res);
    })
})

server.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});

