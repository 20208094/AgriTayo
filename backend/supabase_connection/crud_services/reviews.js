// supabase_connection/reviews.js
const supabase = require('../db');

async function getReviews(req, res) {
    try {
        const { data, error } = await supabase
            .from('reviews')
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

async function addReview(req, res) {
    try {
        const { user_id, product_id, rating, comment } = req.body;
        const { data, error } = await supabase
            .from('reviews')
            .insert([{ user_id, product_id, rating, comment }]);

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(201).json({ message: 'Review added successfully', data });
    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function updateReview(req, res) {
    try {
        const { id } = req.params;
        const { user_id, product_id, rating, comment } = req.body;
        const { data, error } = await supabase
            .from('reviews')
            .update({ user_id, product_id, rating, comment })
            .eq('review_id', id);

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(200).json({ message: 'Review updated successfully', data });
    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function deleteReview(req, res) {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('reviews')
            .delete()
            .eq('review_id', id);

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(200).json({ message: 'Review deleted successfully', data });
    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getReviews,
    addReview,
    updateReview,
    deleteReview
};
