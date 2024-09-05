const supabase = require('../db');
const formidable = require('formidable');
const imageHandler = require('../imageHandler');

// Function to retrieve all chats
async function getChats(req, res) {
    try {
        // Query the Supabase database to get all chat records
        const { data, error } = await supabase
            .from('chats')
            .select('*');

        // Check for Supabase errors
        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error', details: error.message });
        }

        // Return the fetched chat data
        res.json(data);
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

            console.log('Fields:', fields);
            console.log('Files:', files);

            const sender_id = fields.sender_id[0];
            const receiver_id = fields.receiver_id[0];
            const receiver_type = fields.receiver_type[0];
            const chat_message = fields.chat_message[0];
            const image = files.image ? files.image[0] : null;

            let chat_image_url = null;

            if (image) {
                console.log('Uploading image:', image);
                try {
                    chat_image_url = await imageHandler.uploadImage(image);
                    console.log('Image uploaded successfully:', chat_image_url);
                } catch (uploadError) {
                    console.error('Image upload error:', uploadError.message);
                    return res.status(500).json({ error: 'Image upload failed', details: uploadError.message });
                }
            }

            try {
                console.log('Inserting chat message into Supabase');
                const { data, error } = await supabase
                    .from('chats')
                    .insert([{ sender_id, receiver_id, receiver_type, chat_message, chat_image_url, is_read: false }])
                    .select();

                if (error) {
                    console.error('Supabase query failed:', error.message);
                    return res.status(500).json({ error: 'Internal server error', details: error.message });
                }

                console.log('Chat message added successfully:', data);

                // Emit the message and image URL to connected clients using socket.io
                if (data && data.length > 0) {
                    const savedMessage = data[0]; // Get the saved message data
                    const messageToSend = {
                        sender_id: savedMessage.sender_id,
                        receiver_id: savedMessage.receiver_id,
                        receiver_type: savedMessage.receiver_type,
                        chat_message: savedMessage.chat_message,
                        chat_image_url: savedMessage.chat_image_url,
                    };

                    io.emit('chat message', messageToSend); // Broadcast the message
                }

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



// Function to update the read status of a chat message
async function updateChatReadStatus(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'ID is required for update' });
        }

        const { is_read } = req.body;

        try {
            const { data, error } = await supabase
                .from('chats')
                .update({ is_read })
                .eq('chat_id', id);

            if (error) {
                console.error('Supabase query failed:', error.message);
                return res.status(500).json({ error: 'Internal server error', details: error.message });
            }

            res.status(200).json({ message: 'Chat read status updated successfully', data });
        } catch (err) {
            console.error('Error executing Supabase query:', err.message);
            res.status(500).json({ error: 'Internal server error', details: err.message });
        }
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

module.exports = {
    getChats,
    addChat,
    updateChatReadStatus,
    deleteChat
};
