// supabase_connection/notifications.js
const supabase = require('../db');

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
        const { user_id, message, timestamp } = req.body;
        const { data, error } = await supabase
            .from('notifications')
            .insert([{ user_id, message, timestamp }]);

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(201).json({ message: 'Notification added successfully', data });
    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function updateNotification(req, res) {
    try {
        const { id } = req.params;
        const { user_id, message, timestamp } = req.body;
        const { data, error } = await supabase
            .from('notifications')
            .update({ user_id, message, timestamp })
            .eq('notification_id', id);

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(200).json({ message: 'Notification updated successfully', data });
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
    updateNotification,
    deleteNotification
};