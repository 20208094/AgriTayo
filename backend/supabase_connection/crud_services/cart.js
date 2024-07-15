// supabase_connection/cart.js
const supabase = require('../db');

// Get all carts
async function getCarts(req, res) {
    try {
        const { data, error } = await supabase
            .from('cart')
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

// Add a new cart
async function addCart(req, res) {
    try {
        const { cart_total_price, cart_total_weight, cart_user_id, cart_metric_system_id } = req.body;
        const { data, error } = await supabase
            .from('cart')
            .insert([{ 
                cart_total_price,
                cart_total_weight,
                cart_user_id,
                cart_metric_system_id
            }]);

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(201).json({ message: 'Cart added successfully', data });
    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Update an existing cart
async function updateCart(req, res) {
    try {
        const { id } = req.params;
        const { cart_total_price, cart_total_weight, cart_user_id, cart_metric_system_id } = req.body;
        const { data, error } = await supabase
            .from('cart')
            .update({ 
                cart_total_price,
                cart_total_weight,
                cart_user_id,
                cart_metric_system_id
            })
            .eq('cart_id', id);

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(200).json({ message: 'Cart updated successfully', data });
    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Delete a cart
async function deleteCart(req, res) {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('cart')
            .delete()
            .eq('cart_id', id);

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(200).json({ message: 'Cart deleted successfully', data });
    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getCarts,
    addCart,
    updateCart,
    deleteCart
};
