const { Server } = require('socket.io');

let io;
const userSockets = {}; // To keep track of user socket IDs

function initializeSocket(server) {
    io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
        transports: ['websocket', 'polling'],
    });

    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        // Store the user ID associated with the socket ID
        socket.on('login', (userId) => {
            userSockets[userId] = socket.id;
        });

        console.log('Currently connected users:', userSockets);

        // Listen for 'chat message' event from the client
        // Listen for 'chat message' event from the client
        socket.on('chat message', async (msg) => {
            console.log('Chat message event triggered');
            console.log('Message received:', msg);

            try {
                // Create a mock request and response object to pass to addChat
                const req = {
                    body: msg,
                    files: msg.files || {},
                    fields: {
                        sender_id: [msg.sender_id],
                        receiver_id: [msg.receiver_id],
                        receiver_type: [msg.receiver_type],
                        chat_message: [msg.chat_message],
                    },
                };

                const res = {
                    status: (code) => ({
                        json: (data) => console.log(`Response status ${code}:`, data),
                    }),
                };

                // Call your addChat function here
                await addChat(req, res, io);

                // Create a complete message object to emit
                const savedMessage = {
                    sender_id: msg.sender_id,
                    receiver_id: msg.receiver_id,
                    receiver_type: msg.receiver_type,
                    chat_message: msg.chat_message,
                    chat_image_url: msg.chat_image_url || null,
                    is_read: false, // or appropriate value
                    sent_at: new Date().toISOString(), // Current timestamp
                };

                console.log('Emitting message to sender:', savedMessage);

                // Emit the message to the sender
                socket.emit('chat message', savedMessage);

                // Emit the message to the receiver
                const receiverSocketId = userSockets[msg.receiver_id];
                const senderSocketId = userSockets[msg.sender_id];

                if (senderSocketId) {
                    console.log('Emitting message to sender:', savedMessage);
                    io.to(senderSocketId).emit('chat message', savedMessage);
                }

                if (receiverSocketId) {
                    console.log('Emitting message to receiver:', savedMessage);
                    io.to(receiverSocketId).emit('chat message', savedMessage);
                } else {
                    console.log(`No socket found for receiver ID ${msg.receiver_id}`);
                }
            } catch (error) {
                console.error('Error saving message:', error);
            }
        });


        // Listen for 'notification' event from the client
        socket.on('notification', (notification) => {
            console.log('Notification received:', notification);
            io.emit('notification', notification);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
            // Remove the socket from userSockets when the user disconnects
            for (const userId in userSockets) {
                if (userSockets[userId] === socket.id) {
                    delete userSockets[userId];
                    console.log(`User ${userId} disconnected`);
                    break;
                }
            }
        });
    });
}

function getIo() {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
}

module.exports = { initializeSocket, getIo };
