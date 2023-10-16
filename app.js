const express = require("express")
const http = require("http")
const socketio = require("socket.io")
const formatMessage = require("./utils/message")
const {userJoin,getCurrentUser,userLeave,getRoomUsers} = require("./utils/users") 

const app = express()
const server = http.createServer(app)
const io = socketio(server)


app.use(express.static("./public"))

const botName = "ChatApp"

io.on("connection",(socket)=>{
    
    socket.on("joinRoom",({username,room})=>{

        const user = userJoin(socket.id,username,room) 
        socket.join(user.room)


        //User join message
        socket.emit("message",formatMessage(botName,"Welcome to chatroom"))

        //When a user connects
        socket.broadcast.to(user.room).emit("message",formatMessage(botName,`${user.username} has joined the chatroom`)) 

        //Send user and room info
        io.to(user.room).emit("roomusers",{
            room:user.room,
            users:getRoomUsers(user.room)
        })
    })

    console.log("New connection")

    

    //When a user disconnects
    socket.on("disconnect",()=>{
        const user = userLeave(socket.id)

        if(user){
            io.to(user.room).emit("message",formatMessage(botName, `${user.username} has left the chat`))

            io.to(user.room).emit("roomusers",{
                room:user.room,
                users:getRoomUsers(user.room)
            })
        }    
    })

    //Listen for chat message

    socket.on("chatMessage",msg=>{
        const user = getCurrentUser(socket.id)
        io.to(user.room).emit("message",formatMessage(user.username,msg))
    })

})

const port = process.env.PORT||3000
server.listen(port,console.log(`Server is listening on port ${port}`))