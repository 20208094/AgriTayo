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
        const { userId, receiverId } = req.params;
        const receiverIdNum = parseInt(receiverId, 10);
        const userIdNum = parseInt(userId, 10);

        console.log('getchatsid called', userId, receiverId);

        // Supabase query to fetch messages based on sender and receiver
        const { data: messagesUserToReceiver, error: errorUserToReceiver } = await supabase
            .from('chats')
            .select('*')
            .eq('sender_id', userIdNum)
            .eq('receiver_id', receiverIdNum);

        const { data: messagesReceiverToUser, error: errorReceiverToUser } = await supabase
            .from('chats')
            .select('*')
            .eq('sender_id', receiverIdNum)
            .eq('receiver_id', userIdNum);

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
                    .insert([{ sender_id, receiver_id, receiver_type, chat_message, chat_image_url, is_read: false }])
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
                        chat_message: savedMessage.chat_message,
                        chat_image_url: savedMessage.chat_image_url,
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
    addChat,
    updateChatReadStatus,
    deleteChat,
    setSocketIOInstance
};
