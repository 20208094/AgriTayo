// supabase_connection/review_images.js
const supabase = require('../db');
const formidable = require('formidable');
const imageHandler = require('../imageHandler');

async function getReviewImages(req, res) {
    try {
        const { data, error } = await supabase
            .from('review_images')
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

async function addReviewImage(req, res) {
    console.log('went to addReviewImage :', );
    try {
        const form = new formidable.IncomingForm({ multiples: true });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error('Formidable error:', err);
                return res.status(500).json({ error: 'Form parsing error' });
            }

            const shop_id = fields.shop_id[0];
            console.log('shop_id :', shop_id);
            const order_id = fields.order_id[0];
            console.log('order_id :', order_id);
            const image = files.image ? files.image[0] : null;
            console.log('image :', image);

            if (!shop_id || !order_id || !image) {
                return res.status(400).json({ error: 'Shop ID, Order ID and image are required' });
            }

            let review_image_url;

            try {
                review_image_url = await imageHandler.uploadImage(image);
            } catch (uploadError) {
                console.error('Image upload error:', uploadError.message);
                return res.status(500).json({ error: 'Image upload failed' });
            }

            try {
                const { data, error } = await supabase
                    .from('review_images')
                    .insert([{ shop_id, review_image_url, order_id }]);

                if (error) {
                    console.error('Supabase query failed:', error.message);
                    return res.status(500).json({ error: 'Internal server error' });
                }

                res.status(201).json({ message: 'Review image added successfully', data });
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

async function updateReviewImage(req, res) {
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

            const newImage = files.image ? files.image[0] : null;

            if (!newImage) {
                return res.status(400).json({ error: 'New image is required for update' });
            }

            try {
                // Fetch existing data
                const { data: existingData, error: fetchError } = await supabase
                    .from('review_images')
                    .select('image_url')
                    .eq('review_image_id', id)
                    .single();

                if (fetchError) {
                    console.error('Failed to fetch review image:', fetchError.message);
                    return res.status(500).json({ error: 'Failed to fetch review image' });
                }

                const existingImageUrl = existingData.image_url;

                // Delete the existing image
                await imageHandler.deleteImage(existingImageUrl);

                // Upload the new image
                const image_url = await imageHandler.uploadImage(newImage);

                // Update the review image in the database
                const { data, error: updateError } = await supabase
                    .from('review_images')
                    .update({ image_url })
                    .eq('review_image_id', id);

                if (updateError) {
                    console.error('Failed to update review image:', updateError.message);
                    return res.status(500).json({ error: 'Failed to update review image' });
                }

                res.status(200).json({ message: 'Review image updated successfully', data });
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

async function deleteReviewImage(req, res) {
    try {
        const { id } = req.params;

        // Fetch the image URL before deletion
        const { data: reviewImageData, error: fetchError } = await supabase
            .from('review_images')
            .select('image_url')
            .eq('review_image_id', id)
            .single();

        if (fetchError) {
            console.error('Failed to fetch review image:', fetchError.message);
            return res.status(500).json({ error: 'Failed to fetch review image' });
        }

        const imageUrl = reviewImageData.image_url;

        // Delete the image from storage
        await imageHandler.deleteImage(imageUrl);

        // Delete the review image from the database
        const { data, error: deleteError } = await supabase
            .from('review_images')
            .delete()
            .eq('review_image_id', id);

        if (deleteError) {
            console.error('Failed to delete review image from database:', deleteError.message);
            return res.status(500).json({ error: 'Failed to delete review image from database' });
        }

        res.status(200).json({ message: 'Review image deleted successfully', data });
    } catch (err) {
        console.error('Error executing deletion process:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getReviewImages,
    addReviewImage,
    updateReviewImage,
    deleteReviewImage
};
