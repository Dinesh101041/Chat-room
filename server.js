// importing packages
const path = require('path');
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatmessage = require('./utils/messages');
const {userjoin,getuser, userleave, getroomusers} = require('./utils/user');
const user = require('./utils/user');



// create server
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// getting html and css from public folder
app.use(express.static(path.join(__dirname,'public')));

const botname = 'Roombot';

//running socket when client connect
io.on('connection',socket => {
    // getting username and room in the server
    socket.on('joinroom',({username,room})=>{

        const user =  userjoin(socket.id,username,room);
        socket.join(user.room)

        
        // welcome message when current user connect
        socket.emit('message',formatmessage(botname,'Welcome to Chatroom'));
        
        // message when user connect
        socket.broadcast.to(user.room).emit('message',formatmessage(botname,`${user.username} has joined the chat`));

          // sending user and room info on join
    io.to(user.room).emit('roomusers',{
        room:user.room, 
        users:getroomusers(user.room)
    });


    });

  





// listening chat messages
socket.on('chatmessage',msg=> {
    const user =getuser(socket.id);

    // emit message back to every client
   io.to(user.room).emit('message',formatmessage(user.username,msg));
});

//message when client disconnet
socket.on('disconnect',() => {
    const user = userleave(socket.id);
    if(user){
        io.to(user.room).emit('message',formatmessage(botname,`${user.username} has left the chat`));
        

        // sending user and room info on left
        io.to(user.room).emit('roomusers',{
            room:user.room, 
            users:getroomusers(user.room)
        });
    }


});


});

const port = process.env.PORT || 5000;

server.listen(port, () => console.log(`Server running on port ${port} 🔥`));



