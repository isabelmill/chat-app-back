const asyncLocalStorage = require('./als.service');
const logger = require('./logger.service');

var gIo = null

function connectSockets(http, session) {
    gIo = require('socket.io')(http, {
        cors: {
            origin: '*',
        }
    })
    gIo.on('connection', socket => {
        console.log('New socket', socket.id)
        socket.on('disconnect', socket => {
            console.log('Someone disconnected')
        })
        socket.on('chat room', room => {
            if (socket.myRoom === room) return;
            if (socket.myRoom) {
                socket.leave(socket.myRoom)
                console.log('left room', socket.myRoom);
            }
            socket.join(room);
            socket.myRoom = room
            console.log(`User with ID: ${socket.id} joined room: ${room}`);
        })
        socket.on("send message", (data, room) => {
            if (room === '') {
                socket.broadcast.emit("receive message", data);
            } else {
                socket.to(socket.myRoom).emit("receive message", data);
            }
        });
    })
}

module.exports = {
    connectSockets,
}