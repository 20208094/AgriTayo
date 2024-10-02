const supabase = require('../db');

// Get all carts
async function getCarts(req, res) {
    try {
        const { data, error } = await supabase
            .from('cart')
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

async function getCartsId(req, res) {
    try {
        const { userId } = req.params;
        const userIdNum = parseInt(userId, 10);
        // Fetch the cart data for the specific user
        const { data: cartData, error: cartError } = await supabase
            .from('cart')
            .select('*') // Select all columns
            .eq('cart_user_id', userIdNum); // Filter by user ID

        if (cartError) {
            console.error('Error fetching cart data:', cartError.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        // Extract crop IDs from cart data
        const cropIds = cartData.map(item => item.cart_crop_id).filter(Boolean); // Get only defined crop IDs

        let cropsData = [];
        if (cropIds.length > 0) {
            // Fetch the crop data for the cart items
            const { data: cropsResponse, error: cropsError } = await supabase
                .from('crops')
                .select('*') // Select all columns from crops
                .in('crop_id', cropIds); // Filter by crop IDs

            if (cropsError) {
                console.error('Error fetching crops data:', cropsError.message);
                return res.status(500).json({ error: 'Internal server error' });
            }

            cropsData = cropsResponse; // Store crops data
        }

        // Combine cart data with crops data
        const combinedData = cartData.map(cartItem => {
            const crop = cropsData.find(crop => crop.crop_id === cartItem.cart_crop_id);
            return {
                ...cartItem,
                crop: crop || null // Add crop info to cart item
            };
        });

        // Respond with the combined data
        res.json(combinedData);
    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}


// Add a new cart
async function addCart(req, res) {
    try {
        const { cart_total_price, cart_total_quantity, cart_user_id, cart_crop_id, cart_metric_system_id } = req.body;
        const { data, error } = await supabase
            .from('cart')
            .insert([{ 
                cart_total_price,
                cart_total_quantity,
                cart_user_id,
                cart_crop_id,
                cart_metric_system_id
            }]);

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(201).json({ message: 'Cart added successfully', data });
    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Update an existing cart
async function updateCart(req, res) {
    try {
        const { id } = req.params;
        const { cart_total_price, cart_total_quantity, cart_user_id, cart_crop_id, cart_metric_system_id } = req.body;
        const { data, error } = await supabase
            .from('cart')
            .update({ 
                cart_total_price,
                cart_total_quantity,
                cart_user_id,
                cart_crop_id,
                cart_metric_system_id
            })
            .eq('cart_id', id);

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(200).json({ message: 'Cart updated successfully', data });
    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Delete a cart
async function deleteCart(req, res) {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('cart')
            .delete()
            .eq('cart_id', id);

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(200).json({ message: 'Cart deleted successfully', data });
    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getCarts,
    getCartsId,
    addCart,
    updateCart,
    deleteCart
};
