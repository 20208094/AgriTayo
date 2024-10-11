// supabase_connection/userBids.js
const supabase = require('../db');

async function getUserBids(req, res) {
    try {
        const { data, error } = await supabase
            .from('user_bids')
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

async function addUserBid(req, res) {
    try {
        const { bid_id, user_id, price } = req.body;

        // Validate required fields
        if (!bid_id || !user_id || price === undefined) {
            return res.status(400).json({ error: 'Bid ID, User ID, and Price are required.' });
        }

        const { data, error } = await supabase
            .from('user_bids')
            .insert([{ bid_id, user_id, price }]);

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }
        
        res.status(201).json({ message: 'User bid added successfully', data });
    } catch (err) {
        console.error('Unexpected error during addUserBid execution:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function updateUserBid(req, res) {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: 'User Bid ID is required for update' });
        }

        const { bid_id, user_id, price } = req.body;

        // Prepare update data
        const updateData = {};
        if (bid_id) updateData.bid_id = bid_id;
        if (user_id) updateData.user_id = user_id;
        if (price !== undefined) updateData.price = price;

        const { data, error } = await supabase
            .from('user_bids')
            .update(updateData)
            .eq('user_bid_id', id);

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(200).json({ message: 'User bid updated successfully', data });
    } catch (err) {
        console.error('Error executing updateUserBid process:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function deleteUserBid(req, res) {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from('user_bids')
            .delete()
            .eq('user_bid_id', id);

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(200).json({ message: 'User bid deleted successfully', data });
    } catch (err) {
        console.error('Error executing deleteUserBid process:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getUserBids,
    addUserBid,
    updateUserBid,
    deleteUserBid
};
