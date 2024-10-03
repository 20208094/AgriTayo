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

        // Extract crop IDs and metric system IDs from cart data
        const cropIds = cartData.map(item => item.cart_crop_id).filter(Boolean); // Get only defined crop IDs
        const metricSystemIds = cartData.map(item => item.cart_metric_system_id).filter(Boolean); // Get only defined metric system IDs

        let cropsData = [];
        let metricSystemsData = [];

        // Fetch the crop data for the cart items
        if (cropIds.length > 0) {
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

        // Fetch the metric system data for the crops
        if (metricSystemIds.length > 0) {
            const { data: metricSystemsResponse, error: metricSystemsError } = await supabase
                .from('metric_system')
                .select('*') // Select all columns from metric_system
                .in('metric_system_id', metricSystemIds); // Filter by metric system IDs

            if (metricSystemsError) {
                console.error('Error fetching metric system data:', metricSystemsError.message);
                return res.status(500).json({ error: 'Internal server error' });
            }

            metricSystemsData = metricSystemsResponse; // Store metric system data
        }

        // Combine cart data with crops data and metric system data
        const combinedData = cartData.map(cartItem => {
            const crop = cropsData.find(crop => crop.crop_id === cartItem.cart_crop_id);
            const metricSystem = metricSystemsData.find(system => system.metric_system_id === cartItem.cart_metric_system_id);
            return {
                ...cartItem,
                crop: crop || null, // Add crop info to cart item
                metric_system: metricSystem || null // Add metric system info to cart item
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

        // Check if the item already exists in the cart for the same user and crop
        const { data: existingCartItem, error: selectError } = await supabase
            .from('cart')
            .select('*')
            .eq('cart_user_id', cart_user_id)
            .eq('cart_crop_id', cart_crop_id)
            .single(); // Use single() because we expect only one item

        if (selectError && selectError.code !== 'PGRST116') { // Error code 'PGRST116' means "Row not found"
            console.error('Supabase query failed:', selectError.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (existingCartItem) {
            // If the item exists, update the quantity
            const updatedQuantity = existingCartItem.cart_total_quantity + cart_total_quantity;
            const updatedPrice = existingCartItem.cart_total_price + cart_total_price;

            const { data: updatedItem, error: updateError } = await supabase
                .from('cart')
                .update({
                    cart_total_quantity: updatedQuantity,
                    cart_total_price: updatedPrice
                })
                .eq('cart_user_id', cart_user_id)
                .eq('cart_crop_id', cart_crop_id);

            if (updateError) {
                console.error('Supabase update failed:', updateError.message);
                return res.status(500).json({ error: 'Internal server error' });
            }

            return res.status(200).json({ message: 'Cart item updated successfully', data: updatedItem });
        } else {
            // If the item does not exist, insert a new one
            const { data: newItem, error: insertError } = await supabase
                .from('cart')
                .insert([{ 
                    cart_total_price,
                    cart_total_quantity,
                    cart_user_id,
                    cart_crop_id,
                    cart_metric_system_id
                }]);

            if (insertError) {
                console.error('Supabase insert failed:', insertError.message);
                return res.status(500).json({ error: 'Internal server error' });
            }

            return res.status(201).json({ message: 'Cart added successfully', data: newItem });
        }

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
