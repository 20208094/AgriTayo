// supabase_connection/orders.js
const supabase = require('../db');
const { getIo } = require('../../socket');

async function checkoutOrder(req, res) {
    const orderDetails = req.body;
    console.log('orderDetails :', orderDetails);
    let newOrder = {};

    // CREATING THE NEW ORDER
    const {
        totalPrice,
        totalWeight,
        statusId,
        userId,
        shopId,
        orderType,
        shippingMethod,
        paymentMethod,
        shop_number,
        items
    } = orderDetails;

    try {
        const { data, error } = await supabase
            .from('orders')
            .insert([{
                total_price: totalPrice,
                total_weight: totalWeight,
                status_id: statusId,
                user_id: userId,
                shop_id: shopId,
                order_type: orderType,
                shipping_method: shippingMethod,
                payment_method: paymentMethod
            }])
            .select();

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        // CREATING THE ORDER_PRODUCTS
        newOrder = data[0];
        const orderId = newOrder.order_id;

        const orderItems = items.map(item => ({
            order_id: orderId,
            order_prod_crop_id: item.crop_id,
            order_prod_total_weight: item.cart_total_quantity,
            order_prod_total_price: item.cart_total_quantity * item.crop_price,
            order_prod_user_id: item.cart_user_id,
            order_prod_metric_system_id: item.cart_metric_system_id,
            orig_prod_price: item.crop_price,
            orig_prod_metric_symbol: item.metric_system_symbol,
            orig_prod_metric_system: item.metric_system_name,
            orig_prod_shop_id: item.shop_id,
            orig_prod_shop_name: item.shopName,

            orig_prod_name: item.crop_name,
            orig_prod_description: item.crop_description,
            orig_prod_class: item.crop_class,
            orig_prod_image_url: item.crop_image_url,
        }));

        const { data: itemsData, error: itemsError } = await supabase
            .from('order_products')
            .insert(orderItems);

        if (itemsError) {
            console.error('Supabase order items query failed:', itemsError.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        // Access the Socket.io instance
        const io = getIo();

        // After successful checkout, send SMS for each item
        // Define the shop number and title
        const shopNumber = shop_number;
        const title = `AgriTayo`;

        // Aggregate items into a single message string
        let message = `You have a new order with the following items:`;

        items.forEach(item => {
            message += `\n- ${item.cart_total_quantity} ${item.metric_system_symbol} of ${item.crop_name}`;
        });

        // Emit the 'sms sender' event once with the full message
        io.emit('sms sender', {
            title,
            message,
            phone_number: shopNumber
        });

        console.log(`SMS sent to ${shopNumber}: ${title} - ${message}`);


        if (orderDetails.cartType === 'cart') {
            // DELETING THE PRODUCTS IN CART
            const cartIdsToDelete = items.map(item => item.cart_id);

            const { data: cartData, error: cartError } = await supabase
                .from('cart')
                .delete()
                .in('cart_id', cartIdsToDelete);

            if (cartError) {
                console.error('Supabase cart deletion query failed:', cartError.message);
                return res.status(500).json({ error: 'Internal server error' });
            }

            // Return success response with the new order and items data
            return res.status(201).json({ message: 'Order added successfully', newOrder, itemsData, cartData });
        } else if (orderDetails.cartType === 'negotiate') {
            // UPDATING THE NEGOTIATION
            const cartIdsToUpdate = items.map(item => item.cart_id);

            const updateData = {};
            updateData.negotiation_status = 'Completed';

            const { data: cartData, error: cartError } = await supabase
                .from('negotiations')
                .update(updateData)
                .in('negotiation_id', cartIdsToUpdate);

            if (cartError) {
                console.error('Supabase negotiation update query failed:', cartError.message);
                return res.status(500).json({ error: 'Internal server error' });
            }

            return res.status(201).json({ message: 'Order added successfully' });
        } else if (orderDetails.cartType === 'bidding') {
            // UPDATING BIDDING
            const cartIdsToUpdate = items.map(item => item.cart_id);

            const updateData = {};
            updateData.checked_out = true;

            const { data: cartData, error: cartError } = await supabase
                .from('biddings')
                .update(updateData)
                .in('bid_id', cartIdsToUpdate);

            if (cartError) {
                console.error('Supabase negotiation update query failed:', cartError.message);
                return res.status(500).json({ error: 'Internal server error' });
            }

            return res.status(201).json({ message: 'Order added successfully' });
        }


    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    checkoutOrder
};
