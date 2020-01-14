/**
 * USAGE:
 * to use the socket anywhere else in the project
 * 1. include this file `var socketConf = require('../socketConf');`
 * 2. example of how to emit to client - socketConf.io.emit('marketPrices', {msg: 'test'});
 */

const socket_io = require('socket.io');
const io = socket_io();
let socketConf = {};

socketConf.io = io;

io.on('connection', function(socket) {
	console.log('A user connected');
});

// socketConf.sendNotification = function() {
// 	io.sockets.emit('hello', { msg: 'Hello World!' });
// };

module.exports = socketConf;
