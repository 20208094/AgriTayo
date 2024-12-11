// supabase_connection/orders.js
const supabase = require('../db');
const formidable = require("formidable");
const imageHandler = require("../imageHandler");

let io;

function setSocketIOInstance(socketIOInstance) {
    io = socketIOInstance;
}

async function getOrders(req, res) {
    try {
        const { data, error } = await supabase
            .from('orders')
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

async function addOrder(req, res) {
    try {
        const { total_price, total_weight, status_id, user_id, shop_id, order_metric_system_id, order_type, shipping_method, payment_method } = req.body;

        const { data, error } = await supabase
            .from('orders')
            .insert([{ total_price, total_weight, status_id, user_id, shop_id, order_metric_system_id, order_type, shipping_method, payment_method }])
            .select();

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(201).json({ message: 'Order added successfully', data });
    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function updateOrder(req, res) {
    try {
        const { id } = req.params;
        const { total_price, total_weight, status_id, user_id, order_metric_system_id } = req.body;
        const { data, error } = await supabase
            .from('orders')
            .update({ total_price, total_weight, status_id, user_id, order_metric_system_id })
            .eq('order_id', id);

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(200).json({ message: 'Order updated successfully', data });
    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function updateOrderStat(req, res, io) {

    const { id } = req.params;
    const { status_id, buyer_is_received, seller_is_received, allow_return, reject_reason, return_reason, reject_date, order_received_date, return_date, completed_date } = req.body;

    // Fetch shop data
    const { data: shopdata, error: shopError } = await supabase
        .from("shop")
        .select("*");

    if (shopError) {
        console.error("Error fetching shop data:", shopError.message);
        return res.status(500).json({ error: "Error fetching shop data", details: shopError.message });
    }

    try {
        const { data, error } = await supabase
            .from('orders')
            .update({ status_id, buyer_is_received, seller_is_received, allow_return, reject_reason, return_reason, reject_date, order_received_date, return_date, completed_date })
            .eq('order_id', id)
            .select();

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        } else {
            const orderData = data[0];

            const mobileNotifToSend = {};
            // FOR SELLERS USER ID
            if (status_id === 1 || status_id === 5 || status_id === 6 || status_id === 7 || status_id === 8) {
                const shop = shopdata.find(shop => shop.shop_id === orderData.shop_id);
                mobileNotifToSend.user_id = shop.user_id;
            } else {
                // FOR BUYERS USER ID
                mobileNotifToSend.user_id = orderData.user_id;
            }

            // FOR SELLERS
            if (status_id === 1) {
                mobileNotifToSend.title = "New Order";
                mobileNotifToSend.body = "You have a new order.";
            } else if (status_id === 5) {
                mobileNotifToSend.title = "Return Request";
                mobileNotifToSend.body = "A buyer has requested to return their order.";
            } else if (status_id === 6) {
                mobileNotifToSend.title = "Returned Order";
                mobileNotifToSend.body = "An order has been successfully returned.";
            } else if (status_id === 7) {
                mobileNotifToSend.title = "Order Received";
                mobileNotifToSend.body = "A buyer has confirmed that they have received their order.";
            } else if (status_id === 8) {
                mobileNotifToSend.title = "Order Rated";
                mobileNotifToSend.body = "An order has been successfully rated and is now completed.";
            }

            // FOR BUYERS
            if (status_id === 2) {
                mobileNotifToSend.title = "Preparing Order";
                mobileNotifToSend.body = "Your order has been confirmed by the seller and it is now being prepared.";
            } else if (status_id === 3) {
                mobileNotifToSend.title = "Shipping Order";
                mobileNotifToSend.body = "Your order is now being shipped by the seller.";
            } else if (status_id === 4) {
                mobileNotifToSend.title = "Pickup Order";
                mobileNotifToSend.body = "Your order is now ready to be picked up.";
            } else if (status_id === 6) {
                mobileNotifToSend.title = "Returned Order";
                mobileNotifToSend.body = "Your order was successfully returned to the seller.";
            } else if (status_id === 9) {
                mobileNotifToSend.title = "Rejected Order";
                mobileNotifToSend.body = "Your order was rejected by the seller.";
            }
            

            if (io) {
                io.emit('mobilePushNotification', mobileNotifToSend);
            } else {
                console.error('Socket.io instance is undefined');
            }
        }

        res.status(200).json({ message: 'Order updated successfully', data });
    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function orderShopRate(req, res, io) {
    try {
        const { shop_id, order_id, ratings, review, status_id, completed_date, images } = req.body;

        const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .update({
                ratings: ratings,
                review: review,
                completed_date: completed_date,
                status_id: status_id,
            })
            .eq('order_id', order_id)
            .select();

        if (orderError) {
            console.error('Failed to update order rating:', orderError.message);
            return res.status(500).json({ error: 'Failed to update order rating' });
        }

        const { data: sdata, error: serror } = await supabase
            .from("shop") // For the view
            .select("*")
            .eq('shop_id', shop_id)
            .select();

        const old_rating = sdata[0].shop_rating;
        const old_total = sdata[0].shop_total_rating;

        const computed_total = old_total + 1;
        const computed_rating = ((old_rating * old_total) + ratings) / computed_total;
        const formatted_rating = parseFloat(computed_rating.toFixed(2));

        const { data: shopData, error: shopError } = await supabase
            .from('shop')
            .update({
                shop_rating: formatted_rating,
                shop_total_rating: computed_total
            })
            .eq('shop_id', shop_id)
            .select();

        if (shopError) {
            console.error('Failed to update shop rating:', shopError.message);
            return res.status(500).json({ error: 'Failed to update shop rating' });
        }

        // FOR REVIEW IMAGES
        // if (images.length > 0) {
        //     for (const image of images) {
        //         console.log('uploading image :', image);
        //         let review_image_url = null;
        //         console.log('old review_image_url :', review_image_url);

        //         if (image) {
        //             try {
        //                 review_image_url = await imageHandler.uploadImage(image);
        //             } catch (uploadError) {
        //                 console.error("Image upload error:", uploadError.message);
        //                 return res.status(500).json({ error: "Image upload failed" });
        //             }
        //         }
        //         console.log('new review_image_url :', review_image_url);

        //         const { data: review_image_data, error: review_image_error } = await supabase
        //             .from('review_images')
        //             .insert([{ order_id, review_image_url, shop_id }])

        //         if (review_image_error) {
        //             console.error(
        //                 "Supabase review image insertion query failed:",
        //                 review_image_error.message
        //             );
        //             return res.status(500).json({ error: "Internal server error" });
        //         }
        //     }
        // }

        const shopUserId = sdata[0].user_id;
        const mobileNotifToSend = {};
        mobileNotifToSend.user_id = shopUserId;
        mobileNotifToSend.title = "Order Rated";
        mobileNotifToSend.body = "An order has been successfully rated and is now completed.";
        
        if (io) {
            io.emit('mobilePushNotification', mobileNotifToSend);
        } else {
            console.error('Socket.io instance is undefined');
        }

        res.status(200).json({
            message: 'Rating submitted successfully',
            // data: { order: orderData, shop: shopData }
        });
    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function deleteOrder(req, res) {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('orders')
            .delete()
            .eq('order_id', id);

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(200).json({ message: 'Order deleted successfully', data });
    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getOrders,
    addOrder,
    updateOrder,
    updateOrderStat,
    deleteOrder,
    setSocketIOInstance,
    orderShopRate
};
