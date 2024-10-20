const supabase = require('../db'); // Adjust path as necessary
const formidable = require('formidable');
const imageHandler = require('../imageHandler'); // Handle image uploads

// Helper function to get single value from array
const getSingleValue = (value) => Array.isArray(value) ? value[0] : value;

// Get all shops
async function getShops(req, res) {
    try {
        const { data, error } = await supabase
            .from('shop') // For the view
            .select('*');

        // or for the function
        // const { data, error } = await supabase.rpc('get_shops_with_coordinates');

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

// Add a new shop
async function addShop(req, res) {
    try {
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error('Formidable error:', err);
                return res.status(500).json({ error: 'Form parsing error' });
            }

            // Extract fields and ensure single values
            const shop_name = getSingleValue(fields.shop_name);
            const shop_address = getSingleValue(fields.shop_address);
            const longitude = parseFloat(getSingleValue(fields.longitude));
            const latitude = parseFloat(getSingleValue(fields.latitude));
            const shop_location = `SRID=4326;POINT(${longitude} ${latitude})`; // Format with SRID
            const shop_description = getSingleValue(fields.shop_description);
            const user_id = parseInt(getSingleValue(fields.user_id), 10); // Ensure user_id is an integer

            // Validation for required fields
            if (!shop_name || !shop_location || isNaN(user_id)) {
                return res.status(400).json({ error: 'shop_name, shop_location, and valid user_id are required' });
            }

            const shopImageFile = files.image ? files.image[0] : null;
            let shop_image_url = null;

            // Handle image upload
            if (shopImageFile) {
                try {
                    shop_image_url = await imageHandler.uploadImage(shopImageFile);
                    console.log('Image uploaded successfully, URL:', shop_image_url);
                } catch (uploadError) {
                    console.error('Image upload error:', uploadError.message);
                    return res.status(500).json({ error: 'Image upload failed' });
                }
            }

            // Insert shop data into Supabase
            const { data, error } = await supabase
                .from('shop')
                .insert([{
                    shop_name: shop_name,
                    shop_address: shop_address,
                    shop_location: shop_location,  // Ensure the location is correctly formatted
                    shop_description: shop_description,
                    user_id: user_id,
                    shop_image_url: shop_image_url
                }]);

            if (error) {
                console.error('Supabase query failed:', error.message);
                return res.status(500).json({ error: 'Internal server error' });
            }

            res.status(201).json({ message: 'Shop added successfully', data });
        });
    } catch (err) {
        console.error('Error executing addShop process:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Update a shop
async function updateShop(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'ID is required for update' });
        }

        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error('Formidable error:', err);
                return res.status(500).json({ error: 'Form parsing error' });
            }

            // Extract fields and ensure single values
            const shop_name = getSingleValue(fields.shop_name);
            const shop_address = getSingleValue(fields.shop_address);
            const longitude = parseFloat(getSingleValue(fields.longitude));
            const latitude = parseFloat(getSingleValue(fields.latitude));
            const shop_location = `SRID=4326;POINT(${longitude} ${latitude})`; // Format with SRID
            const shop_description = getSingleValue(fields.shop_description);
            const user_id = parseInt(getSingleValue(fields.user_id), 10); // Ensure user_id is an integer

            // Validation for required fields
            if (!shop_name || !shop_location || isNaN(user_id)) {
                return res.status(400).json({ error: 'shop_name, shop_location, and valid user_id are required' });
            }

            const shopImageFile = files.image ? files.image[0] : null;

            // Fetch existing shop data
            const { data: currentShop, error: fetchError } = await supabase
                .from('shop')
                .select('shop_image_url')
                .eq('shop_id', id)
                .single();

            if (fetchError) {
                console.error('Failed to fetch current shop data:', fetchError.message);
                return res.status(500).json({ error: 'Internal server error' });
            }

            const existingImageUrl = currentShop.shop_image_url;
            let shop_image_url;

            // Handle image upload
            if (shopImageFile) {
                // If there is an existing image, delete it first
                if (existingImageUrl) {
                    console.log('Deleting existing image:', existingImageUrl);
                    try {
                        await imageHandler.deleteImage(existingImageUrl);
                        console.log('Existing image successfully deleted');
                    } catch (deleteError) {
                        console.error('Failed to delete existing image:', deleteError.message);
                        return res.status(500).json({ error: 'Failed to delete image' });
                    }
                }

                // Upload the new image
                try {
                    shop_image_url = await imageHandler.uploadImage(shopImageFile);
                    console.log('New image uploaded successfully, URL:', shop_image_url);
                } catch (uploadError) {
                    console.error('Image upload error:', uploadError.message);
                    return res.status(500).json({ error: 'Image upload failed' });
                }
            } else {
                // If no new image is uploaded, keep the existing image URL
                shop_image_url = existingImageUrl;
            }

            // Prepare update data
            const updateData = {
                shop_name: shop_name,
                shop_address: shop_address,
                shop_location: shop_location, // Ensure this is formatted correctly
                shop_description: shop_description,
                user_id: user_id,
                shop_image_url: shop_image_url // Assign the updated image URL
            };

            const { data, error } = await supabase
                .from('shop')
                .update(updateData)
                .eq('shop_id', id);

            if (error) {
                console.error('Supabase query failed:', error.message);
                return res.status(500).json({ error: 'Internal server error' });
            }

            res.status(200).json({ message: 'Shop updated successfully', data });
        });
    } catch (err) {
        console.error('Error executing updateShop process:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Delete a shop
async function deleteShop(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'ID is required for deletion' });
        }

        const { data, error } = await supabase
            .from('shop')
            .delete()
            .eq('shop_id', id);

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(200).json({ message: 'Shop deleted successfully', data });
    } catch (err) {
        console.error('Error executing deleteShop process:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getShops,
    addShop,
    updateShop,
    deleteShop
};