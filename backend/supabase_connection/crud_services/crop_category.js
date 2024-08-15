// supabase_connection/crop_category.js
const supabase = require('../db');

async function getCropCategories(req, res) {
    try {
        const { data, error } = await supabase
            .from('crop_category')
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

async function addCropCategory(req, res) {
    try {
        const { crop_category_name, crop_category_description } = req.body;
        const { data, error } = await supabase
            .from('crop_category')
            .insert([{ crop_category_name, crop_category_description }]);

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(201).json({ message: 'Crop category added successfully', data });
    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function updateCropCategory(req, res) {
    try {
        const { id } = req.params;
        const { crop_category_name, crop_category_description } = req.body;
        const { data, error } = await supabase
            .from('crop_category')
            .update({ crop_category_name, crop_category_description })
            .eq('crop_category_id', id);

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(200).json({ message: 'Crop category updated successfully', data });
    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function deleteCropCategory(req, res) {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('crop_category')
            .delete()
            .eq('crop_category_id', id);

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(200).json({ message: 'Crop category deleted successfully', data });
    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getCropCategories,
    addCropCategory,
    updateCropCategory,
    deleteCropCategory
};