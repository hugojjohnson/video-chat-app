const express = require("express");
const app = express();
const server = require("http").Server(app); // with socket.io
const io = require("socket.io")(server);
const { v4: uuidV4 } = require("uuid");

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.redirect(`/${uuidV4()}`);
});

app.get("/:room", (req, res) => {
    res.render("room", { roomId: req.params.room});
});

io.on("connection", socket => {
    // seting up events to listen to
    socket.on("join-room", (roomId, userId) => {
        console.log(roomId, userId);
        socket.join(roomId); 
        // broadcast means send it to everyone in the same 
        // room, but don't send it to me 
        // (because I already know I've joined).

        
        socket.to(roomId).broadcast.emit("user-connected", userId);

        socket.on("disconnect", () => {
            socket.to(roomId).broadcast.emit("user-disconnected", userId);
        });
    });
});

server.listen(3000);

