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
            // console.log(`User ${userId} logged in with socket ID: ${socket.id}`);
        });

        // console.log('Currently connected users:', userSockets);

        // Listen for 'chat message' event
        socket.on('chat message', (msg) => {
            try {
                // Emit the chat message to the intended receiver
                if (userSockets[msg.receiver_id]) {
                    io.to(userSockets[msg.receiver_id]).emit('chat message', {
                        sender_id: msg.sender_id,
                        receiver_id: msg.receiver_id,
                        receiver_type: msg.receiver_type,
                        chat_message: msg.chat_message,
                        chat_image_url: msg.chat_image_url || null,
                        is_read: false,
                        sent_at: new Date().toISOString(),
                    });
                }
            } catch (error) {
                console.error('Error handling chat message:', error);
            }
        });

        // Listen for 'notification' event from the client
        socket.on('notification', (notif) => {
            try {
                // Emit the notification to the intended user
                if (userSockets[notif.user_id]) {
                    io.to(userSockets[notif.user_id]).emit('notification', {
                        user_id: notif.user_id,
                        title: notif.title,
                        message: notif.message,
                        is_read: false, // Assume it's unread initially
                        notification_date: new Date().toISOString(),
                    });
                }
            } catch (error) {
                console.error('Error handling notification:', error);
            }
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
