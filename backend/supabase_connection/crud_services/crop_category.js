const supabase = require('../db');
const formidable = require('formidable');
const imageHandler = require('../imageHandler');

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
        const form = new formidable.IncomingForm({ multiples: true });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error('Formidable error:', err);
                return res.status(500).json({ error: 'Form parsing error' });
            }

            console.log('Fields:', fields);
            console.log('Files:', files);

            const crop_category_name = fields.crop_category_name[0];
            const crop_category_description = fields.crop_category_description[0];
            const image = files.image ? files.image[0] : null;

            let crop_category_image_url = null;

            if (image) {
                try {
                    crop_category_image_url = await imageHandler.uploadImage(image);
                } catch (uploadError) {
                    console.error('Image upload error:', uploadError.message);
                    return res.status(500).json({ error: 'Image upload failed' });
                }
            }

            try {
                const { data, error } = await supabase
                    .from('crop_category')
                    .insert([{ crop_category_name, crop_category_description, crop_category_image_url }]);

                if (error) {
                    console.error('Supabase query failed:', error.message);
                    return res.status(500).json({ error: 'Internal server error' });
                }

                res.status(201).json({ message: 'Crop category added successfully', data });
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


async function updateCropCategory(req, res) {
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

            const crop_category_name = Array.isArray(fields.crop_category_name) ? fields.crop_category_name[0] : fields.crop_category_name;
            const crop_category_description = Array.isArray(fields.crop_category_description) ? fields.crop_category_description[0] : fields.crop_category_description;
            const newImage = files.image ? files.image[0] : null;

            try {
                // Fetch existing data
                const { data: existingData, error: fetchError } = await supabase
                    .from('crop_category')
                    .select('crop_category_image_url')
                    .eq('crop_category_id', id)
                    .single();

                if (fetchError) {
                    console.error('Failed to fetch crop category:', fetchError.message);
                    return res.status(500).json({ error: 'Failed to fetch crop category' });
                }

                const existingImageUrl = existingData.crop_category_image_url;

                // Delete existing image if necessary
                await imageHandler.deleteImage(existingImageUrl);

                let crop_category_image_url = existingImageUrl;
                if (newImage) {
                    crop_category_image_url = await imageHandler.uploadImage(newImage);
                }

                // Update crop category in database
                const { data, error: updateError } = await supabase
                    .from('crop_category')
                    .update({ crop_category_name, crop_category_description, crop_category_image_url })
                    .eq('crop_category_id', id);

                if (updateError) {
                    console.error('Failed to update crop category:', updateError.message);
                    return res.status(500).json({ error: 'Failed to update crop category' });
                }

                res.status(200).json({ message: 'Crop category updated successfully', data });
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

async function deleteCropCategory(req, res) {
    try {
        const { id } = req.params;

        const { data: cropCategoryData, error: fetchError } = await supabase
            .from('crop_category')
            .select('crop_category_image_url')
            .eq('crop_category_id', id)
            .single();

        if (fetchError) {
            console.error('Failed to fetch crop category:', fetchError.message);
            return res.status(500).json({ error: 'Failed to fetch crop category' });
        }

        const imageUrl = cropCategoryData.crop_category_image_url;

        await imageHandler.deleteImage(imageUrl);

        const { data, error: deleteError } = await supabase
            .from('crop_category')
            .delete()
            .eq('crop_category_id', id);

        if (deleteError) {
            console.error('Failed to delete crop category from database:', deleteError.message);
            return res.status(500).json({ error: 'Failed to delete crop category from database' });
        }

        res.status(200).json({ message: 'Crop category deleted successfully', data });
    } catch (err) {
        console.error('Error executing deletion process:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getCropCategories,
    addCropCategory,
    updateCropCategory,
    deleteCropCategory
};
