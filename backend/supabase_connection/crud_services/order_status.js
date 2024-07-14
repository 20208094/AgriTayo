// supabase_connection/order_status.js
const supabase = require('../db');

async function getOrderStatuses(req, res) {
    try {
        const { data, error } = await supabase
            .from('order_status')
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

async function addOrderStatus(req, res) {
    try {
        const { order_status_name, order_status_description } = req.body;
        const { data, error } = await supabase
            .from('order_status')
            .insert([{ order_status_name, order_status_description }]);

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(201).json({ message: 'Order status added successfully', data });
    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function updateOrderStatus(req, res) {
    try {
        const { id } = req.params;
        const { order_status_name, order_status_description } = req.body;
        const { data, error } = await supabase
            .from('order_status')
            .update({ order_status_name, order_status_description })
            .eq('order_status_id', id);

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(200).json({ message: 'Order status updated successfully', data });
    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function deleteOrderStatus(req, res) {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('order_status')
            .delete()
            .eq('order_status_id', id);

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(200).json({ message: 'Order status deleted successfully', data });
    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getOrderStatuses,
    addOrderStatus,
    updateOrderStatus,
    deleteOrderStatus
};
