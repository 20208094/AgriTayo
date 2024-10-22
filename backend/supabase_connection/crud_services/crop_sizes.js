const supabase = require('../db');
const formidable = require('formidable');

// 1. Get all crop sizes
async function getCropSizes(req, res) {
    try {
        const { data, error } = await supabase
            .from('crop_sizes')
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

// 2. Add a new crop size
async function addCropSize(req, res) {
    try {
        const form = new formidable.IncomingForm();

        form.parse(req, async (err, fields) => {
            if (err) {
                console.error('Formidable error:', err);
                return res.status(500).json({ error: 'Form parsing error' });
            }

            const crop_size_name = fields.crop_size_name[0];
            const crop_size_type = fields.crop_size_type[0];
            const crop_size_description = fields.crop_size_description ? fields.crop_size_description[0] : null;

            try {
                const { data, error } = await supabase
                    .from('crop_sizes')
                    .insert([{
                        crop_size_name,
                        crop_size_type,
                        crop_size_description
                    }]);

                if (error) {
                    console.error('Supabase query failed:', error.message);
                    return res.status(500).json({ error: 'Internal server error' });
                }

                res.status(201).json({ message: 'Crop size added successfully', data });
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

// 3. Update an existing crop size
async function updateCropSize(req, res) {
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

            const crop_size_name = Array.isArray(fields.crop_size_name) ? fields.crop_size_name[0] : fields.crop_size_name;
            const crop_size_type = Array.isArray(fields.crop_size_type) ? fields.crop_size_type[0] : fields.crop_size_type;
            const crop_size_description = fields.crop_size_description ? fields.crop_size_description[0] : null;

            // Update crop size in database
            try {
                const { data, error: updateError } = await supabase
                    .from('crop_sizes')
                    .update({
                        crop_size_name,
                        crop_size_type,
                        crop_size_description
                    })
                    .eq('crop_size_id', id);

                if (updateError) {
                    console.error('Failed to update crop size:', updateError.message);
                    return res.status(500).json({ error: 'Failed to update crop size' });
                }

                res.status(200).json({ message: 'Crop size updated successfully', data });
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

// 4. Delete a crop size
async function deleteCropSize(req, res) {
    try {
        const { id } = req.params;

        const { data, error: deleteError } = await supabase
            .from('crop_sizes')
            .delete()
            .eq('crop_size_id', id);

        if (deleteError) {
            console.error('Failed to delete crop size from database:', deleteError.message);
            return res.status(500).json({ error: 'Failed to delete crop size from database' });
        }

        res.status(200).json({ message: 'Crop size deleted successfully', data });
    } catch (err) {
        console.error('Error executing deletion process:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getCropSizes,
    addCropSize,
    updateCropSize,
    deleteCropSize
};
