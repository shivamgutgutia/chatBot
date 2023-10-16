const express = require("express")
const http = require("http")
const socketio = require("socket.io")

const app = express()
const server = http.createServer(app)
const io = socketio(server)

app.use(express.static("./public"))

io.on("connection",(socket)=>{
    console.log("New connection")

    socket.emit("message","Welcome to chatroom")
})

const port = process.env.PORT||3000
server.listen(port,console.log(`Server is listening on port ${port}`))