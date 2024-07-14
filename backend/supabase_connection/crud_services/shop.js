// supabase_connection/shop.js
const supabase = require('../db');

async function getShops(req, res) {
    try {
        const { data, error } = await supabase
            .from('shop')
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

async function addShop(req, res) {
    try {
        const { shop_name, shop_address, shop_description, user_id } = req.body;
        const { data, error } = await supabase
            .from('shop')
            .insert([{ shop_name, shop_address, shop_description, user_id }]);

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(201).json({ message: 'Shop added successfully', data });
    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function updateShop(req, res) {
    try {
        const { id } = req.params;
        const { shop_name, shop_address, shop_description, user_id } = req.body;
        const { data, error } = await supabase
            .from('shop')
            .update({ shop_name, shop_address, shop_description, user_id })
            .eq('shop_id', id);

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(200).json({ message: 'Shop updated successfully', data });
    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function deleteShop(req, res) {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('shop')
            .delete()
            .eq('shop_id', id);

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(200).json({ message: 'Shop deleted successfully', data });
    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getShops,
    addShop,
    updateShop,
    deleteShop
};
