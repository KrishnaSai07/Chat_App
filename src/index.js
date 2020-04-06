const {generateMessages,generateWelcomeMessage} = require('./utils/messages');
const {addUsers,removeUser,getUser,getAllUser} = require('./utils/users');
const express = require('express');
const path = require('path');
const http = require('http');
const app = express();
const socketio = require('socket.io');
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = socketio(server);
const publicDirPath = path.join(__dirname,'../public');
app.use(express.static(publicDirPath));
server.listen(port, ()=>{
    console.log('server is up');

});
let count =0;


io.on('connection',(socket)=>{
    console.log('New Socket connection');

    // socket.emit('countUpdated',count);

    // socket.on('increment',()=>{
    //     count++;
    //     socket.emit('countUpdated',count);
    // })

    // socket.emit('message',generateMessages('Welcome to Chat App'));

    // socket.broadcast.emit('message',generateMessages('A new User has joined'));

    socket.on('sendMessage',(message,callback)=>{
        const {error,user} = getUser(socket.id);
        if(user)
        {
        io.to(user.room).emit('message',generateMessages(user.username,message));
        callback();
        }
        else
        {
            callback(error);
        }
    })
   
    socket.on('sendLocation',(data,callback)=>{
        const {error,user} = getUser(socket.id);
        io.to(user.room).emit('locationMessage',generateMessages(user.username,`https://www.google.com/maps?q=${data.longitude},${data.latitude}`));
        callback();
    })

    socket.on('join',(data,callback) =>{
      
        console.log(data);

        const {error, user} = addUsers({id: socket.id, username: data.username, room: data.room});
        console.log(error);
        console.log(user);
        if(!error)
        {
           
            socket.join(user.room);
            let usersAll = getAllUser(user.room);
            console.log('Users',usersAll);
        if(usersAll)
        {
            socket.emit('showUsers',{usersAll,room});
        }
            // socket.emit('showUsers',{usersAll,room});
        socket.emit('message',generateMessages('Admin','Welcome to Chat App'));
        socket.broadcast.to(user.room).emit('message',generateMessages('Admin',`${user.username} has joined`));
        callback();
        }
        else
        {
            callback(error);
        }
    });

    socket.on('disconnect',()=>{
        const removedUser = removeUser(socket.id);
        console.log(removedUser);
        io.to(removedUser.room).emit('message',generateMessages('Admin',`${removedUser.username} has left`));
    });

    // socket.on('joinedUsers',(room)=>{
    //     const allUsers = getAllUser(room);
    //     console.log('Users',allUsers);
    //     if(allUsers)
    //     {
    //         socket.emit('showUsers',{allUsers,room});
    //     }
    // })

});

