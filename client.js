const http = require('http');
const { Server } = require('socket.io');


const server = http.createServer();


const io = new Server(server, {
    cors: {
        origin: "*", 
        methods: ["GET", "POST"]
    }
});

const users = {};

io.on('connection', (socket) => {
    

    socket.on('new-user-joined', (Name) => {
        
        users[socket.id] = Name;
        socket.broadcast.emit('user-joined', Name);
    });

    socket.on('send', (message) => {
        socket.broadcast.emit('receive', {
            message: message,
            Name: users[socket.id]
        });
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('user-left', users[socket.id]);
        delete users[socket.id];
    });
});


server.listen(8000, () => {
    console.log("Server listening on http://localhost:8000");
});