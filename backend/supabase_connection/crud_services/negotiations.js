// supabase_connection/negotiations.js
const supabase = require('../db');

// Fetch all negotiations from the database
async function getNegotiations(req, res) {
    try {
        const { data, error } = await supabase
            .from('negotiations')
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

// Add a new negotiation
async function addNegotiation(req, res) {
    try {
        const {
            user_id,
            shop_id,
            crop_id,
            metric_system_id,
            user_price,
            user_amount,
            user_total,
            shop_price = null,
            shop_amount = null,
            shop_total = null,
            user_open_for_negotiation,
            shop_open_for_negotiation = null,
            negotiation_status = 'Ongoing'
        } = req.body;

        // Ensure required fields are provided
        if (!user_id || !shop_id || !crop_id || !metric_system_id || !user_price || !user_amount) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Insert negotiation data into the negotiations table
        const { data, error } = await supabase
            .from('negotiations')
            .insert([{
                user_id: parseInt(user_id, 10),
                shop_id: parseInt(shop_id, 10),
                crop_id: parseInt(crop_id, 10),
                metric_system_id: parseInt(metric_system_id, 10),
                user_price: parseFloat(user_price),
                user_amount: parseFloat(user_amount),
                user_total: user_total ? parseFloat(user_total) : parseFloat(user_price) * parseFloat(user_amount),
                shop_price: shop_price ? parseFloat(shop_price) : null,
                shop_amount: shop_amount ? parseFloat(shop_amount) : null,
                shop_total: shop_total ? parseFloat(shop_total) : null,
                user_open_for_negotiation: Boolean(user_open_for_negotiation),
                shop_open_for_negotiation: Boolean(shop_open_for_negotiation),
                negotiation_status
            }]);

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(201).json({ message: 'Negotiation added successfully', data });
    } catch (err) {
        console.error('Unexpected error during addNegotiation execution:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Update an existing negotiation
async function updateNegotiation(req, res) {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: 'ID is required for update' });
        }

        const {
            user_id,
            shop_id,
            crop_id,
            metric_system_id,
            user_price,
            user_amount,
            user_total,
            shop_price,
            shop_amount,
            shop_total,
            user_open_for_negotiation,
            shop_open_for_negotiation,
            negotiation_status
        } = req.body;

        // Prepare the update data
        const updateData = {};

        if (user_id) updateData.user_id = parseInt(user_id, 10);
        if (shop_id) updateData.shop_id = parseInt(shop_id, 10);
        if (crop_id) updateData.crop_id = parseInt(crop_id, 10);
        if (metric_system_id) updateData.metric_system_id = parseInt(metric_system_id, 10);
        if (user_price) updateData.user_price = parseFloat(user_price);
        if (user_amount) updateData.user_amount = parseFloat(user_amount);
        if (user_total) updateData.user_total = parseFloat(user_total);
        if (shop_price) updateData.shop_price = parseFloat(shop_price);
        if (shop_amount) updateData.shop_amount = parseFloat(shop_amount);
        if (shop_total) updateData.shop_total = parseFloat(shop_total);
        if (user_open_for_negotiation !== undefined) updateData.user_open_for_negotiation = Boolean(user_open_for_negotiation);
        if (shop_open_for_negotiation !== undefined) updateData.shop_open_for_negotiation = Boolean(shop_open_for_negotiation);
        if (negotiation_status) updateData.negotiation_status = negotiation_status;

        // Update the negotiation in the database
        const { data, error } = await supabase
            .from('negotiations')
            .update(updateData)
            .eq('negotiation_id', id);

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(200).json({ message: 'Negotiation updated successfully', data });
    } catch (err) {
        console.error('Error executing updateNegotiation process:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Delete an existing negotiation
async function deleteNegotiation(req, res) {
    try {
        const { id } = req.params;

        // Ensure the ID is provided
        if (!id) {
            return res.status(400).json({ error: 'ID is required for deletion' });
        }

        // Proceed to delete the negotiation from the database
        const { data, error } = await supabase
            .from('negotiations')
            .delete()
            .eq('negotiation_id', id);

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Failed to delete negotiation from database' });
        }

        // Successful deletion response
        res.status(200).json({ message: 'Negotiation deleted successfully', data });
    } catch (err) {
        console.error('Error executing deleteNegotiation process:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getNegotiations,
    addNegotiation,
    updateNegotiation,
    deleteNegotiation
};
