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
        const { crop_id, user_id, rating, review_text } = req.body;
        const { data, error } = await supabase
            .from('reviews')
            .insert([{ crop_id, user_id, rating, review_text }]);

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
        const { crop_id, user_id, rating, review_text } = req.body;
        const { data, error } = await supabase
            .from('reviews')
            .update({ crop_id, user_id, rating, review_text })
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
