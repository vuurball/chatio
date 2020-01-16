const socket_io = require('socket.io');
const io = socket_io();
let socketConf = {};

socketConf.io = io;

let users = new Map(); //connected chat users (online)

io.on('connection', socket => {
	socket.on('join', userName => {
		users.set(socket.id, userName);
		io.emit('onlineUsers', Array.from(users.values()));
		socket.broadcast.emit('joined', userName);
	});
	socket.on('chatMessage', msg => {
		socket.broadcast.emit('chatMessage', {
			userName: users.get(socket.id),
			msg: msg,
		});
	});
	socket.on('userTyping', () => {
		socket.broadcast.emit('userTyping', users.get(socket.id));
	});
	socket.on('disconnect', () => {
		socket.broadcast.emit('left', users.get(socket.id));
		users.delete(socket.id);
		io.emit('onlineUsers', Array.from(users.values()));
	});
});

module.exports = socketConf;
