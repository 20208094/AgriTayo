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
        const { total_price, total_weight, status_id, user_id, shop_id, order_metric_system_id, order_type, shipping_method, payment_method } = req.body;

        const { data, error } = await supabase
            .from('orders')
            .insert([{ total_price, total_weight, status_id, user_id, shop_id, order_metric_system_id, order_type, shipping_method, payment_method }])
            .select(); 

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

async function updateOrderStat(req, res) {

    const { id } = req.params;
    const { status_id, buyer_is_received, seller_is_received, allow_return, reject_reason, return_reason, reject_date, order_received_date, return_date, completed_date } = req.body;
    try {
        const { data, error } = await supabase
            .from('orders')
            .update({ status_id, buyer_is_received, seller_is_received, allow_return, reject_reason, return_reason, reject_date, order_received_date, return_date, completed_date })
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

async function orderShopRate(req, res){
    const { id } = req.params;
    const { review_image_id, review_id, image_url, shop_id, order_id, ratings, review, shop_rating, shop_total_rating } = req.body;
    try {
        const { data, error } = await supabase
            .from('orders')
            .update({ review_image_id, review_id, image_url, shop_id, order_id, ratings, review, shop_rating, shop_total_rating })
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
    updateOrderStat,
    deleteOrder,
    orderShopRate
};
