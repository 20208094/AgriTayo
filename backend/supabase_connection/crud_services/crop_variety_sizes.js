const supabase = require('../db');
const formidable = require('formidable');

// 1. Get all crop variety sizes
async function getCropVarietySizes(req, res) {
    try {
        const { data, error } = await supabase
            .from('crop_variety_sizes')
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

// 2. Add a new crop variety size
async function addCropVarietySize(req, res) {
    try {
        const form = new formidable.IncomingForm();

        form.parse(req, async (err, fields) => {
            if (err) {
                console.error('Formidable error:', err);
                return res.status(500).json({ error: 'Form parsing error' });
            }

            const crop_variety_id = parseInt(fields.crop_variety_id[0]);
            const crop_size_id = parseInt(fields.crop_size_id[0]);

            try {
                const { data, error } = await supabase
                    .from('crop_variety_sizes')
                    .insert([{
                        crop_variety_id,
                        crop_size_id
                    }]);

                if (error) {
                    console.error('Supabase query failed:', error.message);
                    return res.status(500).json({ error: 'Internal server error' });
                }

                res.status(201).json({ message: 'Crop variety size added successfully', data });
            } catch (err) {
                console.error('Error executing Supabase query:', err.message);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// 3. Update an existing crop variety size
async function updateCropVarietySize(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'ID is required for update' });
        }

        const form = new formidable.IncomingForm();

        form.parse(req, async (err, fields) => {
            if (err) {
                console.error('Formidable error:', err);
                return res.status(500).json({ error: 'Form parsing error' });
            }

            const crop_variety_id = parseInt(fields.crop_variety_id[0]);
            const crop_size_id = parseInt(fields.crop_size_id[0]);

            // Update crop variety size in database
            try {
                const { data, error: updateError } = await supabase
                    .from('crop_variety_sizes')
                    .update({
                        crop_variety_id,
                        crop_size_id
                    })
                    .eq('crop_variety_size_id', id);

                if (updateError) {
                    console.error('Failed to update crop variety size:', updateError.message);
                    return res.status(500).json({ error: 'Failed to update crop variety size' });
                }

                res.status(200).json({ message: 'Crop variety size updated successfully', data });
            } catch (error) {
                console.error('Error processing update:', error.message);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    } catch (err) {
        console.error('Error executing update process:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// 4. Delete a crop variety size
async function deleteCropVarietySize(req, res) {
    try {
        const { id } = req.params;

        const { data, error: deleteError } = await supabase
            .from('crop_variety_sizes')
            .delete()
            .eq('crop_variety_size_id', id);

        if (deleteError) {
            console.error('Failed to delete crop variety size from database:', deleteError.message);
            return res.status(500).json({ error: 'Failed to delete crop variety size from database' });
        }

        res.status(200).json({ message: 'Crop variety size deleted successfully', data });
    } catch (err) {
        console.error('Error executing deletion process:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getCropVarietySizes,
    addCropVarietySize,
    updateCropVarietySize,
    deleteCropVarietySize
};
