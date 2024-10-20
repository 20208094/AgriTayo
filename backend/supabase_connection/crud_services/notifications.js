const supabase = require('../db');

let io;

function setSocketIOInstance(socketIOInstance) {
    io = socketIOInstance;
}

async function getNotifications(req, res) {
    try {
        const { data, error } = await supabase
            .from('notifications')
            .select('*');

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.json(data);
    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function addNotification(req, res) {
    try {
        const { user_id, title, message } = req.body;
        console.log('Inserting notification to DB');

        // Insert new notification
        const { data, error } = await supabase
            .from('notifications')
            .insert([{ user_id, title, message }])
            .select(); // Use .select() to return the newly inserted data

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        console.log('Attempting to emit notification');

        if (data && data.length > 0) {
            const savedNotification = data[0];
            const notificationToSend = {
                notification_id: savedNotification.notification_id,
                user_id: savedNotification.user_id,
                title: savedNotification.title,
                message: savedNotification.message,
                is_read: savedNotification.is_read,
            };

            if (io) {
                console.log('Emitting notification');
                io.emit('notification', notificationToSend); // Emit the notification
            } else {
                console.error('Socket.IO instance is undefined');
            }
        }

        res.status(201).json({ message: 'Notification added successfully', data });
    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function markNotificationAsRead(req, res) {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('notification_id', id);

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(200).json({ message: 'Notification marked as read successfully', data });
    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function markAllNotificationsAsRead(req, res) {
    console.log('mark all called')
    const { user_id } = req.body;
    console.log(user_id)
    try {
        const { data, error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('user_id', user_id);

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(200).json({ message: 'All notifications marked as read', data });
    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function deleteNotification(req, res) {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('notifications')
            .delete()
            .eq('notification_id', id);

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(200).json({ message: 'Notification deleted successfully', data });
    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getNotifications,
    addNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    setSocketIOInstance, 
};
