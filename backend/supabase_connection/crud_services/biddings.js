// supabase_connection/biddings.js
const supabase = require('../db');
const formidable = require('formidable');
const imageHandler = require('../imageHandler');

// Fetch all bids from the database
async function getBids(req, res) {
    try {
        const { data, error } = await supabase
            .from('biddings')
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

// Add a new bid to the database
async function addBid(req, res) {
    try {
        const form = new formidable.IncomingForm({ multiples: true });
        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error('Formidable error:', err);
                return res.status(500).json({ error: 'Form parsing error' });
            }

            const {
                shop_id,
                end_date,
                bid_description,
                bid_name,
                bid_subcategory_id,
                bid_starting_price,
                bid_minimum_increment,
                bid_current_highest,
                bid_user_id,
                number_of_bids
            } = fields;

            const getSingleValue = (value) => Array.isArray(value) ? value[0] : value;

            const shopId = parseInt(getSingleValue(shop_id), 10);
            const bidSubcategoryId = parseInt(getSingleValue(bid_subcategory_id), 10);
            const bidStartingPrice = parseFloat(getSingleValue(bid_starting_price));
            const bidMinimumIncrement = parseFloat(getSingleValue(bid_minimum_increment));
            const bidCurrentHighest = parseFloat(getSingleValue(bid_current_highest));
            const bidUserId = parseInt(getSingleValue(bid_user_id), 10);
            const numberOfBids = parseInt(getSingleValue(number_of_bids), 10);

            const bid_image_file = files.bid_image ? files.bid_image[0] : null;
            let bid_image_url = null;

            // Upload image if provided
            if (bid_image_file) {
                try {
                    bid_image_url = await imageHandler.uploadImage(bid_image_file);
                    console.log('Image uploaded successfully, URL:', bid_image_url);
                } catch (uploadError) {
                    console.error('Image upload error:', uploadError.message);
                    return res.status(500).json({ error: 'Image upload failed' });
                }
            }

            // Insert bid data into the biddings table
            const { data, error } = await supabase
                .from('biddings')
                .insert([{
                    shop_id: shopId,
                    end_date: getSingleValue(end_date),
                    bid_description: getSingleValue(bid_description),
                    bid_name: getSingleValue(bid_name),
                    bid_subcategory_id: bidSubcategoryId,
                    bid_starting_price: bidStartingPrice,
                    bid_minimum_increment: bidMinimumIncrement,
                    bid_current_highest: bidCurrentHighest,
                    bid_user_id: bidUserId,
                    number_of_bids: numberOfBids,
                    bid_image: bid_image_url
                }]);

            if (error) {
                console.error('Supabase query failed:', error.message);
                return res.status(500).json({ error: 'Internal server error' });
            }

            res.status(201).json({ message: 'Bid added successfully', data });
        });
    } catch (err) {
        console.error('Unexpected error during addBid execution:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Update an existing bid
async function updateBid(req, res) {
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

            const {
                shop_id,
                end_date,
                bid_description,
                bid_name,
                bid_subcategory_id,
                bid_starting_price,
                bid_minimum_increment,
                bid_current_highest,
                bid_user_id,
                number_of_bids
            } = fields;

            const new_image_file = files.bid_image ? files.bid_image[0] : null;

            // Fetch current bid data to get the existing image URL
            const { data: existingData, error: fetchError } = await supabase
                .from('biddings')
                .select('bid_image')
                .eq('bid_id', id)
                .single();

            if (fetchError) {
                console.error('Failed to fetch existing bid:', fetchError.message);
                return res.status(500).json({ error: 'Failed to fetch existing bid' });
            }

            const existingImageUrl = existingData.bid_image;
            let bid_image_url = existingImageUrl;

            // Handle image upload and deletion of the existing image
            if (new_image_file) {
                console.log('Received new image file for update:', new_image_file);

                // Delete old image if it exists
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
                    bid_image_url = await imageHandler.uploadImage(new_image_file);
                    console.log('New image uploaded successfully, URL:', bid_image_url);
                } catch (uploadError) {
                    console.error('Image upload error:', uploadError.message);
                    return res.status(500).json({ error: 'Image upload failed' });
                }
            }

            const getSingleValue = (value) => Array.isArray(value) ? value[0] : value;

            // Prepare the update data
            const updateData = {
                shop_id: parseInt(getSingleValue(shop_id), 10),
                end_date: getSingleValue(end_date),
                bid_description: getSingleValue(bid_description),
                bid_name: getSingleValue(bid_name),
                bid_subcategory_id: parseInt(getSingleValue(bid_subcategory_id), 10),
                bid_starting_price: parseFloat(getSingleValue(bid_starting_price)),
                bid_minimum_increment: parseFloat(getSingleValue(bid_minimum_increment)),
                bid_current_highest: parseFloat(getSingleValue(bid_current_highest)),
                bid_user_id: parseInt(getSingleValue(bid_user_id), 10),
                number_of_bids: parseInt(getSingleValue(number_of_bids), 10),
                bid_image: bid_image_url
            };

            // Update the bid in the database
            const { data, error } = await supabase
                .from('biddings')
                .update(updateData)
                .eq('bid_id', id);

            if (error) {
                console.error('Supabase query failed:', error.message);
                return res.status(500).json({ error: 'Internal server error' });
            }

            res.status(200).json({ message: 'Bid updated successfully', data });
        });
    } catch (err) {
        console.error('Error executing updateBid process:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Delete an existing bid
async function deleteBid(req, res) {
    try {
        const { id } = req.params;

        // Ensure the ID is provided
        if (!id) {
            return res.status(400).json({ error: 'ID is required for deletion' });
        }

        // Fetch existing bid data including image URL
        const { data: existingData, error: fetchError } = await supabase
            .from('biddings')
            .select('bid_image')
            .eq('bid_id', id)
            .single();

        if (fetchError) {
            console.error('Failed to fetch bid:', fetchError.message);
            return res.status(500).json({ error: 'Failed to fetch bid for deletion' });
        }

        const bidImageUrl = existingData.bid_image;

        // If the bid image exists, delete it
        if (bidImageUrl) {
            try {
                await imageHandler.deleteImage(bidImageUrl);
                console.log('Bid image successfully deleted:', bidImageUrl);
            } catch (deleteError) {
                console.error('Failed to delete bid image:', deleteError.message);
                return res.status(500).json({ error: 'Failed to delete bid image' });
            }
        }

        // Proceed to delete the bid from the database
        const { data, error } = await supabase
            .from('biddings')
            .delete()
            .eq('bid_id', id);

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Failed to delete bid from database' });
        }

        // Successful deletion response
        res.status(200).json({ message: 'Bid deleted successfully', data });
    } catch (err) {
        console.error('Error executing deleteBid process:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getBids,
    addBid,
    updateBid,
    deleteBid
};