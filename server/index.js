const express = require("express");
const http = require("http");
const cors = require("cors")
const {router} = require("./api/router");
const app = express();
const PORT = 5000;
const server = http.createServer(app);
const {Server} = require("socket.io");
const io = new Server(server);
const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));
app.use(router)

app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});

