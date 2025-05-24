const expect = require('chai').expect;
const io = require('socket.io-client');
const http = require('http');
const app = require('../app'); // Import the Express app
const serverSocket = require('../socketConf').io;

const PORT = 3000; // Or any available port

describe('SocketIO Handlers', () => {
	let clientSocket1, clientSocket2, serverInstance;

	before((done) => {
		// Create HTTP server with the Express app
		serverInstance = http.createServer(app);
		// Attach socket.io to the server instance BEFORE listen
		serverSocket.attach(serverInstance);
		// Start the server on a port
		serverInstance.listen(PORT, () => {
			console.log(`Test server listening on port ${PORT}`);
			done();
		});
	});

	after((done) => {
		console.log('Closing test server');
		// Close client connections first
		if (clientSocket1 && clientSocket1.connected) clientSocket1.disconnect();
		if (clientSocket2 && clientSocket2.connected) clientSocket2.disconnect();
		
		// Then close serverSocket (socket.io instance)
		serverSocket.close(() => {
			console.log('Socket.IO server closed.');
			// Finally, close the HTTP server
			if (serverInstance) {
				serverInstance.close(() => {
					console.log('HTTP server closed.');
					done();
				});
			} else {
				done();
			}
		});
	});

	beforeEach((done) => {
		// Connect two clients before each test
		const options = {
			'reconnection delay': 0,
			'reopen delay': 0,
			'force new connection': true,
			timeout: 1000, // Short timeout for tests
		};
		clientSocket1 = io(`http://localhost:${PORT}`, options);
		clientSocket2 = io(`http://localhost:${PORT}`, options);
		
		let connectCount = 0;
		const checkDone = () => {
			connectCount++;
			if (connectCount === 2) {
				done();
			}
		};

		clientSocket1.on('connect', checkDone);
		clientSocket2.on('connect', checkDone);

		clientSocket1.on('connect_error', (err) => console.error('Client1 connect_error:', err));
		clientSocket2.on('connect_error', (err) => console.error('Client2 connect_error:', err));
	});

	afterEach((done) => {
		let disconnectedCount = 0;
		const totalClients = 2; // clientSocket1 and clientSocket2

		const checkDone = () => {
			disconnectedCount++;
			if (disconnectedCount >= totalClients) { // Use >= in case one client was never set up
				done();
			}
		};

		if (clientSocket1) {
			if (clientSocket1.connected) {
				clientSocket1.once('disconnect', checkDone);
				clientSocket1.disconnect();
			} else {
				checkDone(); // Already disconnected or not fully connected
			}
		} else {
			checkDone(); // Not initialized
		}

		if (clientSocket2) {
			if (clientSocket2.connected) {
				clientSocket2.once('disconnect', checkDone);
				clientSocket2.disconnect();
			} else {
				checkDone();
			}
		} else {
			checkDone();
		}
	});

	describe("'join' event", () => {
		it("should add user, emit 'onlineUsers' to all, and broadcast 'joined' to others", (done) => {
			const userName1 = 'Alice';
			const userName2 = 'Bob';
			let client1OnlineUsersReceived = false;
			let client2OnlineUsersReceived = false;
			let client1JoinedEventReceivedForClient2 = false;
			let client2JoinedEventReceivedForClient1 = false;

			const checkDone = () => {
				if (client1OnlineUsersReceived && client2OnlineUsersReceived && client1JoinedEventReceivedForClient2 && client2JoinedEventReceivedForClient1) {
					done();
				}
			};

			// Client 1 joins
			clientSocket1.emit('join', userName1);

			// Client 1 listens for its own onlineUsers update
			clientSocket1.on('onlineUsers', (users) => {
				if (users.length === 1 && users[0] === userName1) {
					// First update for client1 (only itself)
				} else if (users.length === 2 && users.includes(userName1) && users.includes(userName2)) {
					client1OnlineUsersReceived = true;
					checkDone();
				}
			});

			// Client 2 listens for onlineUsers update
			clientSocket2.on('onlineUsers', (users) => {
				if (users.length === 1 && users[0] === userName2) {
					// First update for client2 (only itself, if it were to join first) - not the flow here
				} else if (users.length === 2 && users.includes(userName1) && users.includes(userName2)) {
					client2OnlineUsersReceived = true;
					checkDone();
				}
			});
			
			// Client 2 listens for 'joined' event from Client 1
			clientSocket2.on('joined', (joinedUserName) => {
				if (joinedUserName === userName1) {
					expect(joinedUserName).to.equal(userName1);
					client1JoinedEventReceivedForClient2 = true;
					// Now that client 1 has joined, client 2 joins
					clientSocket2.emit('join', userName2);
				}
			});

			// Client 1 listens for 'joined' event from Client 2
			clientSocket1.on('joined', (joinedUserName) => {
				if (joinedUserName === userName2) {
					expect(joinedUserName).to.equal(userName2);
					client2JoinedEventReceivedForClient1 = true;
					checkDone();
				}
			});
		});
	});

	describe("'chatMessage' event", () => {
		it("should broadcast 'chatMessage' to other clients", (done) => {
			const senderName = 'Alice';
			const recipientName = 'Bob';
			const message = 'Hello everyone!';

			let client1Ready = false;
			let client2Ready = false;

			// Ensure done is called only once
			let doneCalled = false;
			const callDone = () => {
				if (!doneCalled) {
					doneCalled = true;
					done();
				}
			};

			const attemptSend = () => {
				// Ensure both clients are ready (have seen both users online)
				// and the chat message listener is set up on client2
				if (client1Ready && client2Ready) {
					clientSocket2.once('chatMessage', (data) => {
						expect(data.userName).to.equal(senderName);
						expect(data.msg).to.equal(message);
						callDone();
					});
					clientSocket1.emit('chatMessage', message);
				}
			};

			clientSocket1.on('onlineUsers', (users) => {
				if (users.length === 2 && users.includes(senderName) && users.includes(recipientName)) {
					if (!client1Ready) { // Avoid re-triggering logic if event fires multiple times
						client1Ready = true;
						attemptSend();
					}
				} else if (users.length === 1 && users.includes(senderName)) {
					// Client 1 has joined, now client 2 can join
					clientSocket2.emit('join', recipientName);
				}
			});

			clientSocket2.on('onlineUsers', (users) => {
				if (users.length === 2 && users.includes(senderName) && users.includes(recipientName)) {
					if (!client2Ready) { // Avoid re-triggering logic
						client2Ready = true;
						attemptSend();
					}
				}
			});
			
			// Client 1 initiates join
			clientSocket1.emit('join', senderName);
		});
	});

	describe("'userTyping' event", () => {
		it("should broadcast 'userTyping' to other clients", (done) => {
			const typingUserName = 'Bob';

			// Client 1 (Bob) joins
			clientSocket1.emit('join', typingUserName);
			
			// Client 2 (Alice) joins
			clientSocket2.emit('join', 'Alice');

			// Client 2 listens for typing events
			clientSocket2.on('userTyping', (userName) => {
				expect(userName).to.equal(typingUserName);
				done();
			});
			
			// Client 1 emits typing event, but only after it knows it has successfully joined.
			clientSocket1.on('onlineUsers', (users) => {
				// Wait until both users are online to ensure client2 is ready to receive
				if(users.includes(typingUserName) && users.includes('Alice')){
					clientSocket1.emit('userTyping');
				}
			});
		});
	});

	describe("'disconnect' event", () => {
		it("should remove user, broadcast 'left', and emit 'onlineUsers'", (done) => {
			const userName1 = 'Alice'; // Will disconnect
			const userName2 = 'Bob';   // Will stay
			
			let client1JoinedDone = false;
			let client2JoinedDone = false;

			const tryDisconnect = () => {
				if(client1JoinedDone && client2JoinedDone){
					clientSocket1.disconnect();
				}
			}

			// Client 1 joins
			clientSocket1.emit('join', userName1);
			clientSocket1.on('onlineUsers', (users) => {
				if(users.includes(userName1) && users.includes(userName2)){
					client1JoinedDone = true;
					tryDisconnect();
				} else if(users.includes(userName1) && users.length === 1){
					// Alice joined, now Bob can join
					clientSocket2.emit('join', userName2);
				}
			});
			
			// Client 2 joins
			// clientSocket2.emit('join', userName2); // Moved into client1's onlineUser handler
			clientSocket2.on('onlineUsers', (users) => {
				if(users.includes(userName1) && users.includes(userName2)){
					client2JoinedDone = true;
					tryDisconnect();
				}
			});

			// Listen for 'left' on client 2 when client 1 disconnects
			clientSocket2.on('left', (leftUserName) => {
				expect(leftUserName).to.equal(userName1);
				// After client 1 leaves, client 2 should receive updated online users
				clientSocket2.on('onlineUsers', (users) => {
					expect(users).to.deep.equal([userName2]);
					done();
				});
			});
		});
	});
});
