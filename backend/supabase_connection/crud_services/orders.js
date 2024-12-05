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

async function orderShopRate(req, res) {
    try {
        const { shop_id, order_id, ratings, review, shop_rating, shop_total_rating } = req.body;

        // First update the order with the rating and review
        const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .update({ 
                ratings: ratings,
                review: review 
            })
            .eq('order_id', order_id)
            .select();

        if (orderError) {
            console.error('Failed to update order rating:', orderError.message);
            return res.status(500).json({ error: 'Failed to update order rating' });
        }

        // Then update the shop's rating
        const { data: shopData, error: shopError } = await supabase
            .from('shop')
            .update({ 
                shop_rating: shop_rating,
                shop_total_rating: shop_total_rating 
            })
            .eq('shop_id', shop_id)
            .select();

        if (shopError) {
            console.error('Failed to update shop rating:', shopError.message);
            return res.status(500).json({ error: 'Failed to update shop rating' });
        }

        res.status(200).json({ 
            message: 'Rating submitted successfully', 
            data: { order: orderData, shop: shopData } 
        });
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
