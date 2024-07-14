// supabase_connection/orders.js
const supabase = require('../db');

async function getOrders(req, res) {
    try {
        const { data, error } = await supabase
            .from('orders')
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

async function addOrder(req, res) {
    try {
        const { total_price, total_weight, status_id, user_id, order_metric_system_id } = req.body;
        const { data, error } = await supabase
            .from('orders')
            .insert([{ total_price, total_weight, status_id, user_id, order_metric_system_id }]);

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(201).json({ message: 'Order added successfully', data });
    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function updateOrder(req, res) {
    try {
        const { id } = req.params;
        const { total_price, total_weight, status_id, user_id, order_metric_system_id } = req.body;
        const { data, error } = await supabase
            .from('orders')
            .update({ total_price, total_weight, status_id, user_id, order_metric_system_id })
            .eq('order_id', id);

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(200).json({ message: 'Order updated successfully', data });
    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function deleteOrder(req, res) {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('orders')
            .delete()
            .eq('order_id', id);

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(200).json({ message: 'Order deleted successfully', data });
    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getOrders,
    addOrder,
    updateOrder,
    deleteOrder
};