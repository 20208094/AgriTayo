const supabase = require('../db');
const formidable = require('formidable');
const imageHandler = require('../imageHandler');

// 1. Get all crop varieties
async function getCropVarieties(req, res) {
    try {
        const { data, error } = await supabase
            .from('crop_varieties')
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

// 2. Add a new crop variety
async function addCropVariety(req, res) {
    try {
        const form = new formidable.IncomingForm({ multiples: true });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error('Formidable error:', err);
                return res.status(500).json({ error: 'Form parsing error' });
            }

            const crop_variety_name = fields.crop_variety_name[0];
            const crop_variety_description = fields.crop_variety_description[0];
            const crop_category_id = fields.crop_category_id[0];
            const crop_sub_category_id = fields.crop_sub_category_id[0];
            const image = files.image ? files.image[0] : null;

            let crop_variety_image_url = null;

            if (image) {
                try {
                    crop_variety_image_url = await imageHandler.uploadImage(image);
                } catch (uploadError) {
                    console.error('Image upload error:', uploadError.message);
                    return res.status(500).json({ error: 'Image upload failed' });
                }
            }

            try {
                const { data, error } = await supabase
                    .from('crop_varieties')
                    .insert([{
                        crop_variety_name, 
                        crop_variety_description, 
                        crop_variety_image_url, 
                        crop_category_id, 
                        crop_sub_category_id
                    }]);

                if (error) {
                    console.error('Supabase query failed:', error.message);
                    return res.status(500).json({ error: 'Internal server error' });
                }

                res.status(201).json({ message: 'Crop variety added successfully', data });
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

// 3. Update an existing crop variety
async function updateCropVariety(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'ID is required for update' });
        }

        const form = new formidable.IncomingForm({ multiples: true });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error('Formidable error:', err);
                return res.status(500).json({ error: 'Form parsing error' });
            }

            const crop_variety_name = Array.isArray(fields.crop_variety_name) ? fields.crop_variety_name[0] : fields.crop_variety_name;
            const crop_variety_description = Array.isArray(fields.crop_variety_description) ? fields.crop_variety_description[0] : fields.crop_variety_description;
            const crop_category_id = fields.crop_category_id ? fields.crop_category_id[0] : null;
            const crop_sub_category_id = fields.crop_sub_category_id ? fields.crop_sub_category_id[0] : null;
            const newImage = files.image ? files.image[0] : null;

            try {
                // Fetch existing data
                const { data: existingData, error: fetchError } = await supabase
                    .from('crop_varieties')
                    .select('crop_variety_image_url')
                    .eq('crop_variety_id', id)
                    .single();

                if (fetchError) {
                    console.error('Failed to fetch crop variety:', fetchError.message);
                    return res.status(500).json({ error: 'Failed to fetch crop variety' });
                }

                const existingImageUrl = existingData.crop_variety_image_url;

                // Delete existing image if necessary
                if (existingImageUrl && newImage) {
                    await imageHandler.deleteImage(existingImageUrl);
                }

                let crop_variety_image_url = existingImageUrl;
                if (newImage) {
                    crop_variety_image_url = await imageHandler.uploadImage(newImage);
                }

                // Update crop variety in database
                const { data, error: updateError } = await supabase
                    .from('crop_varieties')
                    .update({
                        crop_variety_name,
                        crop_variety_description,
                        crop_variety_image_url,
                        crop_category_id,
                        crop_sub_category_id
                    })
                    .eq('crop_variety_id', id);

                if (updateError) {
                    console.error('Failed to update crop variety:', updateError.message);
                    return res.status(500).json({ error: 'Failed to update crop variety' });
                }

                res.status(200).json({ message: 'Crop variety updated successfully', data });
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

// 4. Delete a crop variety
async function deleteCropVariety(req, res) {
    try {
        const { id } = req.params;

        const { data: cropVarietyData, error: fetchError } = await supabase
            .from('crop_varieties')
            .select('crop_variety_image_url')
            .eq('crop_variety_id', id)
            .single();

        if (fetchError) {
            console.error('Failed to fetch crop variety:', fetchError.message);
            return res.status(500).json({ error: 'Failed to fetch crop variety' });
        }

        const imageUrl = cropVarietyData.crop_variety_image_url;

        if (imageUrl) {
            await imageHandler.deleteImage(imageUrl);
        }

        const { data, error: deleteError } = await supabase
            .from('crop_varieties')
            .delete()
            .eq('crop_variety_id', id);

        if (deleteError) {
            console.error('Failed to delete crop variety from database:', deleteError.message);
            return res.status(500).json({ error: 'Failed to delete crop variety from database' });
        }

        res.status(200).json({ message: 'Crop variety deleted successfully', data });
    } catch (err) {
        console.error('Error executing deletion process:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getCropVarieties,
    addCropVariety,
    updateCropVariety,
    deleteCropVariety
};
