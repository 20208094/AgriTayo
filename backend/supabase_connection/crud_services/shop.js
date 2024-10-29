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
            const shop_description = getSingleValue(fields.shop_description);
            const user_id = parseInt(getSingleValue(fields.user_id)); // Ensure user_id is an integer
            const delivery = getSingleValue(fields.delivery);
            const pickup = getSingleValue(fields.pickup);
            const delivery_price = parseInt(getSingleValue(fields.delivery_price), 10);
            const pickup_price = parseInt(getSingleValue(fields.pickup_price), 10);
            const gcash = getSingleValue(fields.gcash);
            const cod = getSingleValue(fields.cod);
            const bank = getSingleValue(fields.bank);
            const shop_number = getSingleValue(fields.shop_number);
            const submit_later = getSingleValue(fields.submit_later);
            const tin_number = getSingleValue(fields.tin_number);
            const pickup_address = getSingleValue(fields.pickup_address);


            const shopImageFile = files.shop_image ? files.shop_image[0] : null;
            console.log(shopImageFile);
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

            // BIR IMAGE UPLOAD
            const birImageFile = files.bir_image ? files.bir_image[0] : null;
            let bir_image_url = null;

            // Handle image upload
            if (birImageFile) {
                try {
                    bir_image_url = await imageHandler.uploadImage(birImageFile);
                    console.log('Image uploaded successfully, URL:', bir_image_url);
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
                    shop_description: shop_description,
                    user_id: user_id,
                    shop_image_url: shop_image_url,
                    delivery: delivery,
                    pickup: pickup,
                    delivery_price: delivery_price,
                    pickup_price: pickup_price,
                    gcash: gcash,
                    cod: cod,
                    bank: bank,
                    shop_number: shop_number,
                    submit_later: submit_later,
                    tin_number: tin_number,
                    bir_image_url: bir_image_url,
                    pickup_address: pickup_address,
                }]);

            if (error) {
                console.error('Supabase query failed:', error.message);
                return res.status(500).json({ error: 'Internal server error' });
            }

            const updateUserData = {
                user_type_id: 2
            }
            const { data1, error1 } = await supabase
                .from('users')
                .update(updateUserData)
                .eq('user_id', user_id);

            if (error1) {
                console.error('Supabase query failed:', error1.message);
                return res.status(500).json({ error: 'Internal server error' });
            }


            res.status(201).json({ message: 'Shop added successfully', data, data1 });
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
            const shop_description = getSingleValue(fields.shop_description);
            const user_id = parseInt(getSingleValue(fields.user_id)); // Ensure user_id is an integer
            const delivery = getSingleValue(fields.delivery);
            const pickup = getSingleValue(fields.pickup);
            const delivery_price = parseInt(getSingleValue(fields.delivery_price), 10);
            const pickup_price = parseInt(getSingleValue(fields.pickup_price), 10);
            const gcash = getSingleValue(fields.gcash);
            const cod = getSingleValue(fields.cod);
            const bank = getSingleValue(fields.bank);
            const shop_number = getSingleValue(fields.shop_number);
            const submit_later = getSingleValue(fields.submit_later);
            const tin_number = getSingleValue(fields.tin_number);
            const pickup_address = getSingleValue(fields.pickup_address);

            //shop image upload
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //BIR image upload
            const birImageFile = files.bir_image ? files.bir_image[0] : null;

            // Fetch existing shop data
            const { data: currentbir, error: fetchError1 } = await supabase
                .from('shop')
                .select('bir_image_url')
                .eq('shop_id', id)
                .single();

            if (fetchError1) {
                console.error('Failed to fetch current shop data:', fetchError1.message);
                return res.status(500).json({ error: 'Internal server error' });
            }

            const existingBirImageUrl = currentbir.bir_image_url;
            let bir_image_url;

            // Handle image upload
            if (birImageFile) {
                // If there is an existing image, delete it first
                if (existingBirImageUrl) {
                    console.log('Deleting existing image:', existingBirImageUrl);
                    try {
                        await imageHandler.deleteImage(existingBirImageUrl);
                        console.log('Existing image successfully deleted');
                    } catch (deleteError) {
                        console.error('Failed to delete existing image:', deleteError.message);
                        return res.status(500).json({ error: 'Failed to delete image' });
                    }
                }

                // Upload the new image
                try {
                    bir_image_url = await imageHandler.uploadImage(birImageFile);
                    console.log('New image uploaded successfully, URL:', bir_image_url);
                } catch (uploadError) {
                    console.error('Image upload error:', uploadError.message);
                    return res.status(500).json({ error: 'Image upload failed' });
                }
            } else {
                // If no new image is uploaded, keep the existing image URL
                bir_image_url = existingBirImageUrl;
            }

            // Prepare update data
            const updateData = {
                shop_name: shop_name,
                shop_address: shop_address,
                shop_description: shop_description,
                user_id: user_id,
                shop_image_url: shop_image_url, // Assign the updated image URL
                delivery: delivery,
                pickup: pickup,
                delivery_price: delivery_price,
                pickup_price: pickup_price,
                gcash: gcash,
                cod: cod,
                bank: bank,
                shop_number: shop_number,
                submit_later: submit_later,
                tin_number: tin_number,
                bir_image_url: bir_image_url,
                pickup_address: pickup_address,
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