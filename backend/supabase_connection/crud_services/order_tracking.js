// supabase_connection/order_tracking.js
const supabase = require('../db');

async function getOrderTrackings(req, res) {
    try {
        const { data, error } = await supabase
            .from('order_tracking')
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

async function addOrderTracking(req, res) {
    try {
        const { order_id, status } = req.body;
        const { data, error } = await supabase
            .from('order_tracking')
            .insert([{ order_id, status }]);

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(201).json({ message: 'Order tracking added successfully', data });
    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function updateOrderTracking(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const { data, error } = await supabase
            .from('order_tracking')
            .update({ status })
            .eq('tracking_id', id);

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(200).json({ message: 'Order tracking updated successfully', data });
    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function deleteOrderTracking(req, res) {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('order_tracking')
            .delete()
            .eq('tracking_id', id);

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(200).json({ message: 'Order tracking deleted successfully', data });
    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getOrderTrackings,
    addOrderTracking,
    updateOrderTracking,
    deleteOrderTracking
};
