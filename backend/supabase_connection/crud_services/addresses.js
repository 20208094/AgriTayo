// supabase_connection/addresses.js
const supabase = require('../db');

async function getAddresses(req, res) {
    try {
        const { data, error } = await supabase
            .from('addresses')
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

async function addAddress(req, res) {
    try {
        const { user_id, address, label, note, latitude, longitude } = req.body;
        const { data, error } = await supabase
            .from('addresses')
            .insert([{ user_id, address, label, note, latitude, longitude }]);

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(201).json({ message: 'Address added successfully', data });
    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function updateAddress(req, res) {
    try {
        const { id } = req.params;
        const { user_id, address, label, note, latitude, longitude } = req.body;
        const { data, error } = await supabase
            .from('addresses')
            .update({ user_id, address, label, note, latitude, longitude })
            .eq('address_id', id);

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(200).json({ message: 'Address updated successfully', data });
    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function deleteAddress(req, res) {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('addresses')
            .delete()
            .eq('address_id', id);

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(200).json({ message: 'Address deleted successfully', data });
    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getAddresses,
    addAddress,
    updateAddress,
    deleteAddress
};
