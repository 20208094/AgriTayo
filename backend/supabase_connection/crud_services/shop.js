// supabase_connection/shop.js
const supabase = require('../db');
const formidable = require('formidable');
const imageHandler = require('../imageHandler'); // Utility module to handle image uploads

async function getShops(req, res) {
    try {
        const { data, error } = await supabase
            .from('shop')
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

async function addShop(req, res) {
    try {
        const form = new formidable.IncomingForm({ multiples: true });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error('Formidable error:', err);
                return res.status(500).json({ error: 'Form parsing error' });
            }

            const { shop_name, shop_address, shop_description, user_id } = fields;
            const shop_image_file = files.shop_image ? files.shop_image[0] : null;

            let shop_image_url = null;
            if (shop_image_file) {
                try {
                    shop_image_url = await imageHandler.uploadImage(shop_image_file);
                } catch (uploadError) {
                    console.error('Image upload error:', uploadError.message);
                    return res.status(500).json({ error: 'Image upload failed' });
                }
            }

            const { data, error } = await supabase
                .from('shop')
                .insert([{
                    shop_name,
                    shop_address,
                    shop_description,
                    user_id,
                    shop_image_url
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

async function updateShop(req, res) {
    try {
        const { id } = req.params;

        const form = new formidable.IncomingForm({ multiples: true });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error('Formidable error:', err);
                return res.status(500).json({ error: 'Form parsing error' });
            }

            const { shop_name, shop_address, shop_description, user_id } = fields;
            const new_image_file = files.shop_image ? files.shop_image[0] : null;

            let shop_image_url = null;
            if (new_image_file) {
                // Fetch existing image URL
                const { data: existingData, error: fetchError } = await supabase
                    .from('shop')
                    .select('shop_image_url')
                    .eq('shop_id', id)
                    .single();

                if (fetchError) {
                    console.error('Failed to fetch existing shop:', fetchError.message);
                    return res.status(500).json({ error: 'Failed to fetch existing shop' });
                }

                const existingImageUrl = existingData.shop_image_url;

                // Delete old image
                if (existingImageUrl) {
                    await imageHandler.deleteImage(existingImageUrl);
                }

                // Upload new image
                try {
                    shop_image_url = await imageHandler.uploadImage(new_image_file);
                } catch (uploadError) {
                    console.error('Image upload error:', uploadError.message);
                    return res.status(500).json({ error: 'Image upload failed' });
                }
            }

            const { data, error } = await supabase
                .from('shop')
                .update({
                    shop_name,
                    shop_address,
                    shop_description,
                    user_id,
                    shop_image_url: shop_image_url || undefined // Only update image URL if a new image was uploaded
                })
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

async function deleteShop(req, res) {
    try {
        const { id } = req.params;

        // Fetch existing shop data including image URL
        const { data: existingData, error: fetchError } = await supabase
            .from('shop')
            .select('shop_image_url')
            .eq('shop_id', id)
            .single();

        if (fetchError) {
            console.error('Failed to fetch shop:', fetchError.message);
            return res.status(500).json({ error: 'Failed to fetch shop' });
        }

        const shopImageUrl = existingData.shop_image_url;

        // Delete the image
        if (shopImageUrl) {
            await imageHandler.deleteImage(shopImageUrl);
        }

        // Delete the shop from the database
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
