// supabase_connection/order_products.js
const supabase = require('../db');

async function getOrderProducts(req, res) {
    try {
        const { data, error } = await supabase
            .from('order_products')
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

async function addOrderProduct(req, res) {
    try {
        const { order_id, product_id, quantity } = req.body;
        const { data, error } = await supabase
            .from('order_products')
            .insert([{ order_id, product_id, quantity }]);

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(201).json({ message: 'Order product added successfully', data });
    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function updateOrderProduct(req, res) {
    try {
        const { id } = req.params;
        const { order_id, product_id, quantity } = req.body;
        const { data, error } = await supabase
            .from('order_products')
            .update({ order_id, product_id, quantity })
            .eq('order_product_id', id);

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(200).json({ message: 'Order product updated successfully', data });
    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function deleteOrderProduct(req, res) {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('order_products')
            .delete()
            .eq('order_product_id', id);

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(200).json({ message: 'Order product deleted successfully', data });
    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getOrderProducts,
    addOrderProduct,
    updateOrderProduct,
    deleteOrderProduct
};
