const supabase = require('../db');
const { uploadImage, deleteImage } = require('../imageHandler'); // Ensure to import your image handler functions

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
        let crop_category_image_url = '';

        if (req.file) {
            console.log('Uploading image...');
            try {
                const { fileName, filePath } = await uploadImage(req.file);
                crop_category_image_url = `https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/${fileName}`;
                console.log('Image uploaded successfully:', crop_category_image_url);
            } catch (error) {
                console.error('Error uploading image:', error.message);
                return res.status(500).json({ error: 'Error uploading image' });
            }
        }

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
}

async function updateCropCategory(req, res) {
    try {
        const { id } = req.params;
        const { crop_category_name, crop_category_description, crop_category_image_url: newImageUrl } = req.body;
        let updatedImageUrl = newImageUrl;

        if (req.file) {
            const { data: existingCategory } = await supabase
                .from('crop_category')
                .select('crop_category_image_url')
                .eq('crop_category_id', id)
                .single();

            if (existingCategory && existingCategory.crop_category_image_url) {
                try {
                    console.log('Deleting old image:', existingCategory.crop_category_image_url);
                    await deleteImage(existingCategory.crop_category_image_url);
                } catch (error) {
                    console.error('Error deleting old image:', error.message);
                    return res.status(500).json({ error: 'Error deleting old image' });
                }
            }

            console.log('Uploading new image...');
            try {
                const { fileName } = await uploadImage(req.file);
                updatedImageUrl = `https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/${fileName}`;
                console.log('New image uploaded successfully:', updatedImageUrl);
            } catch (error) {
                console.error('Error uploading new image:', error.message);
                return res.status(500).json({ error: 'Error uploading new image' });
            }
        }

        const { data, error } = await supabase
            .from('crop_category')
            .update({ crop_category_name, crop_category_description, crop_category_image_url: updatedImageUrl })
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
        const { data: existingCategory } = await supabase
            .from('crop_category')
            .select('crop_category_image_url')
            .eq('crop_category_id', id)
            .single();

        if (existingCategory && existingCategory.crop_category_image_url) {
            try {
                console.log('Deleting image:', existingCategory.crop_category_image_url);
                await deleteImage(existingCategory.crop_category_image_url);
            } catch (error) {
                console.error('Error deleting image:', error.message);
                return res.status(500).json({ error: 'Error deleting image' });
            }
        }

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
