const supabase = require('../db');

async function getCartProducts(req, res) {
    try {
        const { data, error } = await supabase
            .from('cart_products')
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

async function addCartProduct(req, res) {
    try {
        const { cart_id, cart_prod_crop_id, cart_prod_total_weight, cart_prod_total_price, cart_prod_user_id, cart_prod_metric_system_id } = req.body;
        const { data, error } = await supabase
            .from('cart_products')
            .insert([{ cart_id, cart_prod_crop_id, cart_prod_total_weight, cart_prod_total_price, cart_prod_user_id, cart_prod_metric_system_id }]);

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(201).json({ message: 'Cart product added successfully', data });
    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function updateCartProduct(req, res) {
    try {
        const { id } = req.params;
        const { cart_id, cart_prod_crop_id, cart_prod_total_weight, cart_prod_total_price, cart_prod_user_id, cart_prod_metric_system_id } = req.body;
        const { data, error } = await supabase
            .from('cart_products')
            .update({ cart_id, cart_prod_crop_id, cart_prod_total_weight, cart_prod_total_price, cart_prod_user_id, cart_prod_metric_system_id })
            .eq('cart_prod_id', id);

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(200).json({ message: 'Cart product updated successfully', data });
    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function deleteCartProduct(req, res) {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('cart_products')
            .delete()
            .eq('cart_prod_id', id);

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(200).json({ message: 'Cart product deleted successfully', data });
    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getCartProducts,
    addCartProduct,
    updateCartProduct,
    deleteCartProduct
};
