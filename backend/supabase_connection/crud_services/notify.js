const supabase = require('../db'); // Your Supabase instance

async function notifySeller(productId, buyerId) {
    // Assuming you can get the seller's user ID from the product ID
    const { data: productData, error: productError } = await supabase
        .from('products')
        .select('seller_id')
        .eq('id', productId)
        .single();

    if (productError) {
        console.error('Error fetching seller:', productError.message);
        return;
    }

    const sellerId = productData.seller_id;

    // Create a notification for the seller
    const { error: notificationError } = await supabase
        .from('notifications')
        .insert([
            {
                user_id: sellerId,
                type: 'purchase',
                message: `A buyer has purchased your product.`,
                is_read: false
            }
        ]);

    if (notificationError) {
        console.error('Error inserting notification:', notificationError.message);
    }
}

module.exports = {
    notifySeller
};
