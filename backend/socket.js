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

        socket.on('chat message', async (msg) => {
            try {
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
                // Emit the message to the sender
                socket.emit('chat message', savedMessage);

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
