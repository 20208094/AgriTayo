// supabase_connection/crops.js
const supabase = require('../db');
const formidable = require('formidable');
const imageHandler = require('../imageHandler');

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
        const form = new formidable.IncomingForm({ multiples: true });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error('Formidable error:', err);
                return res.status(500).json({ error: 'Form parsing error' });
            }

            const {
                crop_name,
                crop_description,
                sub_category_id,
                shop_id,
                crop_rating,
                crop_price,
                crop_quantity,
                crop_weight,
                metric_system_id
            } = fields;
            const crop_image_file = files.crop_image ? files.crop_image[0] : null;

            let crop_image_url = null;
            if (crop_image_file) {
                try {
                    crop_image_url = await imageHandler.uploadImage(crop_image_file);
                } catch (uploadError) {
                    console.error('Image upload error:', uploadError.message);
                    return res.status(500).json({ error: 'Image upload failed' });
                }
            }

            const { data, error } = await supabase
                .from('crops')
                .insert([{
                    crop_name,
                    crop_description,
                    sub_category_id,
                    shop_id,
                    crop_image_url,
                    crop_rating,
                    crop_price,
                    crop_quantity,
                    crop_weight,
                    metric_system_id
                }]);

            if (error) {
                console.error('Supabase query failed:', error.message);
                return res.status(500).json({ error: 'Internal server error' });
            }

            res.status(201).json({ message: 'Crop added successfully', data });
        });
    } catch (err) {
        console.error('Error executing addCrop process:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function updateCrop(req, res) {
    try {
        const { id } = req.params;

        const form = new formidable.IncomingForm({ multiples: true });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error('Formidable error:', err);
                return res.status(500).json({ error: 'Form parsing error' });
            }

            const {
                crop_name,
                crop_description,
                sub_category_id,
                shop_id,
                crop_rating,
                crop_price,
                crop_quantity,
                crop_weight,
                metric_system_id
            } = fields;
            const new_image_file = files.crop_image ? files.crop_image[0] : null;

            let crop_image_url = null;
            if (new_image_file) {
                // Fetch existing image URL
                const { data: existingData, error: fetchError } = await supabase
                    .from('crops')
                    .select('crop_image_url')
                    .eq('crop_id', id)
                    .single();

                if (fetchError) {
                    console.error('Failed to fetch existing crop:', fetchError.message);
                    return res.status(500).json({ error: 'Failed to fetch existing crop' });
                }

                const existingImageUrl = existingData.crop_image_url;

                // Delete old image
                if (existingImageUrl) {
                    await imageHandler.deleteImage(existingImageUrl);
                }

                // Upload new image
                try {
                    crop_image_url = await imageHandler.uploadImage(new_image_file);
                } catch (uploadError) {
                    console.error('Image upload error:', uploadError.message);
                    return res.status(500).json({ error: 'Image upload failed' });
                }
            }

            const { data, error } = await supabase
                .from('crops')
                .update({
                    crop_name,
                    crop_description,
                    sub_category_id,
                    shop_id,
                    crop_image_url: crop_image_url || undefined,  // Only update image URL if a new image was uploaded
                    crop_rating,
                    crop_price,
                    crop_quantity,
                    crop_weight,
                    metric_system_id
                })
                .eq('crop_id', id);

            if (error) {
                console.error('Supabase query failed:', error.message);
                return res.status(500).json({ error: 'Internal server error' });
            }

            res.status(200).json({ message: 'Crop updated successfully', data });
        });
    } catch (err) {
        console.error('Error executing updateCrop process:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function deleteCrop(req, res) {
    try {
        const { id } = req.params;

        // Fetch existing crop data including image URL
        const { data: existingData, error: fetchError } = await supabase
            .from('crops')
            .select('crop_image_url')
            .eq('crop_id', id)
            .single();

        if (fetchError) {
            console.error('Failed to fetch crop:', fetchError.message);
            return res.status(500).json({ error: 'Failed to fetch crop' });
        }

        const cropImageUrl = existingData.crop_image_url;

        // Delete the image
        if (cropImageUrl) {
            await imageHandler.deleteImage(cropImageUrl);
        }

        // Delete the crop from the database
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
        console.error('Error executing deleteCrop process:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getCrops,
    addCrop,
    updateCrop,
    deleteCrop
};
