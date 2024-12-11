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

        // Handle user login and store the user ID associated with the socket ID
        socket.on('login', (userId) => {
            userSockets[userId] = socket.id;
            console.log(`User ${userId} logged in with socket ID: ${socket.id}`);

            // Emit the updated active users list to all clients
            io.emit('activeUsers', Object.keys(userSockets));
            console.log('Currently active users:', Object.keys(userSockets));
        });

        // Listen for chat messages and forward them to the correct recipient
        socket.on('chat message', (msg) => {
            try {
                // Emit the chat message to the intended receiver
                if (userSockets[msg.receiver_id]) {
                    io.to(userSockets[msg.receiver_id]).emit('chat message', {
                        sender_id: msg.sender_id,
                        receiver_id: msg.receiver_id,
                        receiver_type: msg.receiver_type,
                        sender_type: msg.sender_type,
                        chat_message: msg.chat_message,
                        chat_image_url: msg.chat_image_url || null,
                        is_read: false,
                        sent_at: msg.sent_at,
                    });
                }
            } catch (error) {
                console.error('Error handling chat message:', error);
            }
        });

        // Listen for notifications and send them to the correct user
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

        socket.on('mobilePushNotification', (notif) => {
            console.log('triggering mobile push notification')
            try {
                // Emit the notification to all connected clients
                io.emit('mobilePushNotification', {
                    user_id: notif.user_id, // Target user ID
                    title: notif.title || "Default Notification Title", // Notification title
                    body: notif.message || "Default notification message", // Notification body
                });
            } catch (error) {
                console.error('Error handling notification:', error);
            }
        });

        socket.on('requestActiveUsers', () => {
            // Emit the current list of active users to the requesting client
            socket.emit('activeUsers', Object.keys(userSockets));
        });

        // Handle user disconnects
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
            // Remove the disconnected user's socket from userSockets
            for (const userId in userSockets) {
                if (userSockets[userId] === socket.id) {
                    delete userSockets[userId];
                    console.log(`User ${userId} disconnected`);

                    // Emit the updated active users list to all clients
                    io.emit('activeUsers', Object.keys(userSockets));
                    console.log('Currently active users after disconnect:', Object.keys(userSockets));
                    break;
                }
            }
        });

        socket.on('sms sender', async (data) => {
            try {
                const { title, message, phone_number } = data;
                console.log('SMS request received:', title, message, phone_number);

                socket.broadcast.emit('sms sender', { title, message, phone_number });

                // Emit a confirmation or error response back to the sender (if needed)
                socket.emit('sms status', { status: 'SMS received', title, message, phone_number });
                // await emitWithAck(socket, 'sms status', JSON.stringify({ title, message, phone_number }));
            } catch (error) {
                console.error('Error handling SMS sender:', error);
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
