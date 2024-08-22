// supabase_connection/crop_sub_categories.js
const supabase = require('../db');
const formidable = require('formidable');
const imageHandler = require('../imageHandler');

async function getCropSubCategories(req, res) {
    try {
        const { data, error } = await supabase
            .from('crop_sub_category')
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

async function addCropSubCategory(req, res) {
    try {
        const form = new formidable.IncomingForm({ multiples: true });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error('Formidable error:', err);
                return res.status(500).json({ error: 'Form parsing error' });
            }

            const crop_sub_category_name = fields.crop_sub_category_name[0];
            const crop_sub_category_description = fields.crop_sub_category_description[0];
            const crop_category_id = fields.crop_category_id[0];
            const image = files.image ? files.image[0] : null;

            let crop_sub_category_image_url = null;

            if (image) {
                try {
                    crop_sub_category_image_url = await imageHandler.uploadImage(image);
                } catch (uploadError) {
                    console.error('Image upload error:', uploadError.message);
                    return res.status(500).json({ error: 'Image upload failed' });
                }
            }

            try {
                const { data, error } = await supabase
                    .from('crop_sub_category')
                    .insert([{ 
                        crop_sub_category_name, 
                        crop_sub_category_description, 
                        crop_sub_category_image_url, 
                        crop_category_id 
                    }]);

                if (error) {
                    console.error('Supabase query failed:', error.message);
                    return res.status(500).json({ error: 'Internal server error' });
                }

                res.status(201).json({ message: 'Crop sub-category added successfully', data });
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

async function updateCropSubCategory(req, res) {
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

            const crop_sub_category_name = Array.isArray(fields.crop_sub_category_name) ? fields.crop_sub_category_name[0] : fields.crop_sub_category_name;
            const crop_sub_category_description = Array.isArray(fields.crop_sub_category_description) ? fields.crop_sub_category_description[0] : fields.crop_sub_category_description;
            const crop_category_id = Array.isArray(fields.crop_category_id) ? fields.crop_category_id[0] : fields.crop_category_id;
            const newImage = files.image ? files.image[0] : null;

            try {
                // Fetch existing data
                const { data: existingData, error: fetchError } = await supabase
                    .from('crop_sub_category')
                    .select('crop_sub_category_image_url')
                    .eq('crop_sub_category_id', id)
                    .single();

                if (fetchError) {
                    console.error('Failed to fetch crop sub-category:', fetchError.message);
                    return res.status(500).json({ error: 'Failed to fetch crop sub-category' });
                }

                const existingImageUrl = existingData.crop_sub_category_image_url;

                // Delete existing image if necessary
                await imageHandler.deleteImage(existingImageUrl);

                let crop_sub_category_image_url = existingImageUrl;
                if (newImage) {
                    crop_sub_category_image_url = await imageHandler.uploadImage(newImage);
                }

                // Update crop sub-category in the database
                const { data, error: updateError } = await supabase
                    .from('crop_sub_category')
                    .update({ 
                        crop_sub_category_name, 
                        crop_sub_category_description, 
                        crop_sub_category_image_url, 
                        crop_category_id 
                    })
                    .eq('crop_sub_category_id', id);

                if (updateError) {
                    console.error('Failed to update crop sub-category:', updateError.message);
                    return res.status(500).json({ error: 'Failed to update crop sub-category' });
                }

                res.status(200).json({ message: 'Crop sub-category updated successfully', data });
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

async function deleteCropSubCategory(req, res) {
    try {
        const { id } = req.params;

        // Fetch image URL before deletion
        const { data: cropSubCategoryData, error: fetchError } = await supabase
            .from('crop_sub_category')
            .select('crop_sub_category_image_url')
            .eq('crop_sub_category_id', id)
            .single();

        if (fetchError) {
            console.error('Failed to fetch crop sub-category:', fetchError.message);
            return res.status(500).json({ error: 'Failed to fetch crop sub-category' });
        }

        const imageUrl = cropSubCategoryData.crop_sub_category_image_url;

        // Delete associated image
        await imageHandler.deleteImage(imageUrl);

        // Delete the crop sub-category from the database
        const { data, error: deleteError } = await supabase
            .from('crop_sub_category')
            .delete()
            .eq('crop_sub_category_id', id);

        if (deleteError) {
            console.error('Failed to delete crop sub-category from database:', deleteError.message);
            return res.status(500).json({ error: 'Failed to delete crop sub-category from database' });
        }

        res.status(200).json({ message: 'Crop sub-category deleted successfully', data });
    } catch (err) {
        console.error('Error executing deletion process:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getCropSubCategories,
    addCropSubCategory,
    updateCropSubCategory,
    deleteCropSubCategory
};
