const supabase = require('../db');
const formidable = require('formidable');
const imageHandler = require('../imageHandler');

let io;

function setSocketIOInstance(socketIOInstance) {
    io = socketIOInstance;
}

// Function to retrieve all chats
async function getChats(req, res) {
    try {
        const { data, error } = await supabase.from('chats').select('*');

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error', details: error.message });
        }

        res.json(data);
    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
}

async function getChatsId(req, res) { 
    try {
        const { userId, receiverId, receiverType, senderType } = req.params;
        const receiverIdNum = parseInt(receiverId, 10);
        const userIdNum = parseInt(userId, 10);

        console.log('getChatsId called', userId, receiverId, receiverType, senderType);

        // Supabase query to fetch messages based on sender and receiver
        const { data: messagesUserToReceiver, error: errorUserToReceiver } = await supabase
            .from('chats')
            .select('*')
            .eq('sender_id', userIdNum)
            .eq('receiver_id', receiverIdNum)
            .eq('sender_type', senderType)
            .eq('receiver_type', receiverType);

        const { data: messagesReceiverToUser, error: errorReceiverToUser } = await supabase
            .from('chats')
            .select('*')
            .eq('sender_id', receiverIdNum)
            .eq('receiver_id', userIdNum)
            .eq('sender_type', receiverType)
            .eq('receiver_type', senderType);

        if (errorUserToReceiver || errorReceiverToUser) {
            console.error('Supabase query failed:', errorUserToReceiver?.message || errorReceiverToUser?.message);
            return res.status(500).json({ error: 'Internal server error', details: errorUserToReceiver?.message || errorReceiverToUser?.message });
        }

        // Combine both results
        const filteredMessages = [...(messagesUserToReceiver || []), ...(messagesReceiverToUser || [])];

        // Return the filtered messages
        res.json(filteredMessages);
    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
}

async function getChatList(req, res) { 
    try {
        const { userId, receiverType, senderType } = req.params;
        const userIdNum = parseInt(userId, 10);

        // Step 1: Fetch all users except the logged-in user (userId)
        const { data: allUsers, error: errorUsers } = await supabase
            .from('users')
            .select('*')
            .neq('user_id', userIdNum); // Exclude the logged-in user

        if (errorUsers) {
            console.error('Supabase query failed for users:', errorUsers.message);
            return res.status(500).json({ error: 'Internal server error', details: errorUsers.message });
        }

        // Step 2: Fetch chats where the logged-in user is the sender
        const { data: messagesUserToReceiver, error: errorUserToReceiver } = await supabase
            .from('chats')
            .select('*')
            .eq('sender_id', userIdNum)
            .eq('sender_type', senderType)
            .eq('receiver_type', receiverType);

        // Step 3: Fetch chats where the logged-in user is the receiver
        const { data: messagesReceiverToUser, error: errorReceiverToUser } = await supabase
            .from('chats')
            .select('*')
            .eq('sender_id', userIdNum)
            .eq('sender_type', receiverType)
            .eq('receiver_type', senderType);

        if (errorUserToReceiver || errorReceiverToUser) {
            console.error('Supabase query failed:', errorUserToReceiver?.message || errorReceiverToUser?.message);
            return res.status(500).json({ error: 'Internal server error', details: errorUserToReceiver?.message || errorReceiverToUser?.message });
        }

        // Step 4: Combine both chat results
        const allChats = [...(messagesUserToReceiver || []), ...(messagesReceiverToUser || [])];

        // Step 5: Map each user with their latest chat time
        const userChatMap = allUsers.map(user => {
            // Filter chats involving this user
            const userChats = allChats.filter(chat => 
                chat.sender_id === user.user_id || chat.receiver_id === user.user_id
            );

            // Get the latest chat time
            const latestChat = userChats.reduce((latest, chat) => {
                return (!latest || new Date(chat.sent_at) > new Date(latest.sent_at)) ? chat : latest;
            }, null);

            return {
                user_id: user.user_id,
                firstname: user.firstname,
                user_image_url: user.user_image_url,
                latest_chat_time: latestChat ? latestChat.sent_at : null,
            };
        });

        // Step 6: Sort users by latest chat time, placing users with no chats at the bottom
        userChatMap.sort((a, b) => {
            if (a.latest_chat_time === null) return 1;
            if (b.latest_chat_time === null) return -1;
            return new Date(b.latest_chat_time) - new Date(a.latest_chat_time);
        });

        // Return the sorted chat list
        res.json(userChatMap);
    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
}


async function getChatShopList(req, res) { 
    try {
        const { userId, receiverType, senderType } = req.params;
        const userIdNum = parseInt(userId, 10);

        // Step 1: Fetch all shops
        const { data: allShops, error: errorShops } = await supabase
            .from('shop')
            .select('*');

        if (errorShops) {
            console.error('Supabase query failed for shops:', errorShops.message);
            return res.status(500).json({ error: 'Internal server error', details: errorShops.message });
        }

        // Step 2: Fetch chats where the logged-in user is the sender
        const { data: messagesUserToShop, error: errorUserToShop } = await supabase
            .from('chats')
            .select('*')
            .eq('sender_id', userIdNum)
            .eq('sender_type', senderType)
            .eq('receiver_type', receiverType);

        // Step 3: Fetch chats where the logged-in user is the receiver
        const { data: messagesShopToUser, error: errorShopToUser } = await supabase
            .from('chats')
            .select('*')
            .eq('sender_id', userIdNum)
            .eq('sender_type', receiverType)
            .eq('receiver_type', senderType);

        if (errorUserToShop || errorShopToUser) {
            console.error('Supabase query failed:', errorUserToShop?.message || errorShopToUser?.message);
            return res.status(500).json({ error: 'Internal server error', details: errorUserToShop?.message || errorShopToUser?.message });
        }

        // Step 4: Combine results from steps 2 and 3
        const combinedMessages = [
            ...(messagesUserToShop || []),
            ...(messagesShopToUser || [])
        ];
        
        // Step 5: Create a map to store the latest chat time for each shop
        const latestChatMap = {};

        // Iterate through the combined messages to find the latest chat time for each shop
        combinedMessages.forEach(chat => {
            const shopId = chat.receiver_id; // Assuming receiver_id corresponds to shop_id
            const chatTime = chat.sent_at;

            // Update the latest chat time if it's more recent
            if (!latestChatMap[shopId] || new Date(chatTime) > new Date(latestChatMap[shopId])) {
                latestChatMap[shopId] = chatTime;
            }
        });

        // Step 6: Map shops to include the latest chat time
        const result = allShops.map(shop => ({
            shop_id: shop.shop_id,
            shop_name: shop.shop_name,
            shop_image_url: shop.shop_image_url,
            latest_chat_time: latestChatMap[shop.shop_id] || null,
        }));
        console.log('result :', result);

        res.json(result); // Send the result as JSON
    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
}

// Function to add a new chat message with an optional image
async function addChat(req, res, io) {
    try {
        console.log('Processing add chat request');
        const form = new formidable.IncomingForm({ multiples: true });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error('Formidable error:', err.message);
                return res.status(500).json({ error: 'Form parsing error', details: err.message });
            }

            const sender_id = fields.sender_id[0];
            const receiver_id = fields.receiver_id[0];
            const receiver_type = fields.receiver_type[0];
            const sender_type = fields.sender_type[0];
            const chat_message = fields.chat_message[0];
            const image = files.image ? files.image[0] : null;

            let chat_image_url = null;

            if (image) {
                try {
                    chat_image_url = await imageHandler.uploadImage(image);
                } catch (uploadError) {
                    console.error('Image upload error:', uploadError.message);
                    return res.status(500).json({ error: 'Image upload failed', details: uploadError.message });
                }
            }

            try {
                const { data, error } = await supabase
                    .from('chats')
                    .insert([{ sender_id, receiver_id, receiver_type, sender_type, chat_message, chat_image_url, is_read: false }])
                    .select();

                if (error) {
                    console.error('Supabase query failed:', error.message);
                    return res.status(500).json({ error: 'Internal server error', details: error.message });
                }

                console.log('Added chat to db');

                if (data && data.length > 0) {
                    const savedMessage = data[0]; 
                    const messageToSend = {
                        sender_id: savedMessage.sender_id,
                        receiver_id: savedMessage.receiver_id,
                        receiver_type: savedMessage.receiver_type,
                        sender_type: savedMessage.sender_type,
                        chat_message: savedMessage.chat_message,
                        chat_image_url: savedMessage.chat_image_url,
                        sent_at: new Date().toISOString(),
                    };

                    if (io) { // Ensure io is defined
                        io.emit('chat message', messageToSend); // Broadcast the message
                        console.log('emited message');
                    } else {
                        console.error('Socket.io instance is undefined');
                    }
                }
                console.log('closing message api');
                res.status(201).json({ message: 'Chat added successfully', data });
            } catch (err) {
                console.error('Error executing Supabase query:', err.message);
                res.status(500).json({ error: 'Internal server error', details: err.message });
            }
        });
    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
}

async function updateChatReadStatus(req, res) {
    const { sender_id, user_id } = req.body; 
    const userId = user_id;

    try {
        if (!sender_id || !userId) {
            return res.status(400).json({ error: 'Sender ID and User ID are required for update' });
        }

        // Update all messages where the sender_id matches and the receiver_id is the user
        const { error } = await supabase
            .from('chats')
            .update({ is_read: true })
            .eq('sender_id', sender_id)
            .eq('receiver_id', userId);

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error', details: error.message });
        }

        if (io) {
            // Emit a blank socket event
            io.emit('chat message', {}); // Emit an empty object
            console.log('Emitted read status for chat messages');
        }

        res.status(200).json({ message: 'Chat read status updated successfully' });
    } catch (err) {
        console.error('Error executing update process:', err.message);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
}

// Function to delete a chat message, including associated image
async function deleteChat(req, res) {
    try {
        const { id } = req.params;

        const { data: chatData, error: fetchError } = await supabase
            .from('chats')
            .select('chat_image_url')
            .eq('chat_id', id)
            .single();

        if (fetchError) {
            console.error('Failed to fetch chat:', fetchError.message);
            return res.status(500).json({ error: 'Failed to fetch chat', details: fetchError.message });
        }

        const imageUrl = chatData.chat_image_url;

        // Delete the associated image if it exists
        if (imageUrl) {
            try {
                await imageHandler.deleteImage(imageUrl);
            } catch (deleteError) {
                console.error('Image deletion error:', deleteError.message);
                return res.status(500).json({ error: 'Image deletion failed', details: deleteError.message });
            }
        }

        const { data, error: deleteError } = await supabase
            .from('chats')
            .delete()
            .eq('chat_id', id);

        if (deleteError) {
            console.error('Failed to delete chat from database:', deleteError.message);
            return res.status(500).json({ error: 'Failed to delete chat from database', details: deleteError.message });
        }

        res.status(200).json({ message: 'Chat deleted successfully', data });
    } catch (err) {
        console.error('Error executing deletion process:', err.message);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
}

// Export functions and the function to set the socket instance
module.exports = {
    getChats,
    getChatsId,
    getChatList,
    getChatShopList,
    addChat,
    updateChatReadStatus,
    deleteChat,
    setSocketIOInstance
};
