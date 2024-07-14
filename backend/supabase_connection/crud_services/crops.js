// supabase_connection/crops.js
const supabase = require('../db');

async function getCrops(req, res) {
    try {
        const { data, error } = await supabase
            .from('crops')
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

async function addCrop(req, res) {
    try {
        const { crop_name, crop_description, category_id, shop_id, crop_image, crop_rating, crop_price, crop_quantity, crop_weight, metric_system_id } = req.body;
        const { data, error } = await supabase
            .from('crops')
            .insert([{ crop_name, crop_description, category_id, shop_id, crop_image, crop_rating, crop_price, crop_quantity, crop_weight, metric_system_id }]);

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(201).json({ message: 'Crop added successfully', data });
    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function updateCrop(req, res) {
    try {
        const { id } = req.params;
        const { crop_name, crop_description, category_id, shop_id, crop_image, crop_rating, crop_price, crop_quantity, crop_weight, metric_system_id } = req.body;
        const { data, error } = await supabase
            .from('crops')
            .update({ crop_name, crop_description, category_id, shop_id, crop_image, crop_rating, crop_price, crop_quantity, crop_weight, metric_system_id })
            .eq('crop_id', id);

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(200).json({ message: 'Crop updated successfully', data });
    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function deleteCrop(req, res) {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('crops')
            .delete()
            .eq('crop_id', id);

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(200).json({ message: 'Crop deleted successfully', data });
    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getCrops,
    addCrop,
    updateCrop,
    deleteCrop
};
