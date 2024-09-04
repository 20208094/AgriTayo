require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer'); // For handling file uploads
const { createServer } = require('http'); 
const { Server } = require('socket.io');

// Import CRUD services
const {
    getSampleData,
    addSampleData,
    updateSampleData,
    deleteSampleData
} = require('./supabase_connection/crud_services/sampleData');

const {
    getUserTypes,
    addUserType,
    updateUserType,
    deleteUserType
} = require('./supabase_connection/crud_services/user_type');

const {
    getUsers,
    addUser,
    updateUser,
    deleteUser
} = require('./supabase_connection/crud_services/users');

const {
    getAddresses,
    addAddress,
    updateAddress,
    deleteAddress
} = require('./supabase_connection/crud_services/addresses');

const {
    getShops,
    addShop,
    updateShop,
    deleteShop
} = require('./supabase_connection/crud_services/shop');

const {
    getCropCategories,
    addCropCategory,
    updateCropCategory,
    deleteCropCategory
} = require('./supabase_connection/crud_services/crop_category');

const {
    getMetricSystems,
    addMetricSystem,
    updateMetricSystem,
    deleteMetricSystem
} = require('./supabase_connection/crud_services/metric_system');

const {
    getCrops,
    addCrop,
    updateCrop,
    deleteCrop
} = require('./supabase_connection/crud_services/crops');

const {
    getOrderStatuses,
    addOrderStatus,
    updateOrderStatus,
    deleteOrderStatus
} = require('./supabase_connection/crud_services/order_status');

const {
    getOrders,
    addOrder,
    updateOrder,
    deleteOrder
} = require('./supabase_connection/crud_services/orders');

const {
    getOrderProducts,
    addOrderProduct,
    updateOrderProduct,
    deleteOrderProduct
} = require('./supabase_connection/crud_services/order_products');

const {
    getCarts,
    addCart,
    updateCart,
    deleteCart
} = require('./supabase_connection/crud_services/cart');

const {
    getCartProducts,
    addCartProduct,
    updateCartProduct,
    deleteCartProduct
} = require('./supabase_connection/crud_services/cart_products');

const {
    getReviews,
    addReview,
    updateReview,
    deleteReview
} = require('./supabase_connection/crud_services/reviews');

const {
    getOrderTrackings,
    addOrderTracking,
    updateOrderTracking,
    deleteOrderTracking
} = require('./supabase_connection/crud_services/order_tracking');

const {
    getPayments,
    addPayment,
    updatePayment,
    deletePayment
} = require('./supabase_connection/crud_services/payments');

const {
    getNotifications,
    addNotification,
    markNotificationAsRead,
    deleteNotification
} = require('./supabase_connection/crud_services/notifications');

const {
    getCropSubCategories,
    addCropSubCategory,
    updateCropSubCategory,
    deleteCropSubCategory
} = require('./supabase_connection/crud_services/crop_sub_category.js');

const {
    getReviewImages,
    addReviewImage,
    updateReviewImage,
    deleteReviewImage
} = require('./supabase_connection/crud_services/review_images.js');

const { login } = require('./supabase_connection/user_auth_services/login');
const { register } = require('./supabase_connection/user_auth_services/register');
const { logout } = require('./supabase_connection/user_auth_services/logout');


const app = express();

const server = createServer(app); // Create the HTTP server

// Initialize Socket.IO
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins (you can restrict this)
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 8080;

// Middleware setup for session
app.use(session({
    secret: 'AgriTayoKey2024', // Replace with a secure random key
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// Multer setup for handling file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Log the API key to the console for debugging purposes
console.log('API Key:', process.env.API_KEY);

const apiKeyMiddleware = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (apiKey && apiKey === process.env.API_KEY) {
        next(); // API key is valid, proceed to the next middleware or route handler
    } else {
        res.status(403).json({ error: 'Forbidden - Invalid API Key' });
    }
};

app.use('/api/', apiKeyMiddleware);


// API for session
app.get('/api/session', (req, res) => {
    if (req.session && req.session.user) {
        res.json({
            user_id: req.session.user.user_id,
            user_firstname: req.session.user.user_firstname,
            user_type_id: req.session.user.user_type_id,
            user_hashed_password: req.session.user.password
        });
    } else {
        res.status(404).json({ error: 'Session data not found' });
    }
});

// API for login
app.post('/api/login', login);

// API for register
app.post('/api/register', register);

// API for logout
app.post('/api/logout', logout);

// API routes for sample data
app.get('/api/data/sample', getSampleData);
app.post('/api/data/sample', addSampleData);
app.put('/api/data/sample/:id', updateSampleData);
app.delete('/api/data/sample/:id', deleteSampleData);

// API routes for user types
app.get('/api/user_types', getUserTypes);
app.post('/api/user_types', addUserType);
app.put('/api/user_types/:id', updateUserType);
app.delete('/api/user_types/:id', deleteUserType);

// API routes for users
app.get('/api/users', getUsers);
app.post('/api/users', addUser);
app.put('/api/users/:id', updateUser);
app.delete('/api/users/:id', deleteUser);

// API routes for addresses
app.get('/api/addresses', getAddresses);
app.post('/api/addresses', addAddress);
app.put('/api/addresses/:id', updateAddress);
app.delete('/api/addresses/:id', deleteAddress);

// API routes for shops
app.get('/api/shops', getShops);
app.post('/api/shops', addShop);
app.put('/api/shops/:id', updateShop);
app.delete('/api/shops/:id', deleteShop);

// API routes for crop categories
app.get('/api/crop_categories', getCropCategories);
app.post('/api/crop_categories', addCropCategory);
app.put('/api/crop_categories/:id', updateCropCategory);
app.delete('/api/crop_categories/:id', deleteCropCategory);

// API routes for metric systems
app.get('/api/metric_systems', getMetricSystems);
app.post('/api/metric_systems', addMetricSystem);
app.put('/api/metric_systems/:id', updateMetricSystem);
app.delete('/api/metric_systems/:id', deleteMetricSystem);

// API routes for crops
app.get('/api/crops', getCrops);
app.post('/api/crops', addCrop);
app.put('/api/crops/:id', updateCrop);
app.delete('/api/crops/:id', deleteCrop);

// API routes for order statuses
app.get('/api/order_statuses', getOrderStatuses);
app.post('/api/order_statuses', addOrderStatus);
app.put('/api/order_statuses/:id', updateOrderStatus);
app.delete('/api/order_statuses/:id', deleteOrderStatus);

// API routes for orders
app.get('/api/orders', getOrders);
app.post('/api/orders', addOrder);
app.put('/api/orders/:id', updateOrder);
app.delete('/api/orders/:id', deleteOrder);

// API routes for order products
app.get('/api/order_products', getOrderProducts);
app.post('/api/order_products', addOrderProduct);
app.put('/api/order_products/:id', updateOrderProduct);
app.delete('/api/order_products/:id', deleteOrderProduct);

// API routes for carts
app.get('/api/carts', getCarts);
app.post('/api/carts', addCart);
app.put('/api/carts/:id', updateCart);
app.delete('/api/carts/:id', deleteCart);

// API routes for cart products
app.get('/api/cart_products', getCartProducts);
app.post('/api/cart_products', addCartProduct);
app.put('/api/cart_products/:id', updateCartProduct);
app.delete('/api/cart_products/:id', deleteCartProduct);

// API routes for reviews
app.get('/api/reviews', getReviews);
app.post('/api/reviews', addReview);
app.put('/api/reviews/:id', updateReview);
app.delete('/api/reviews/:id', deleteReview);

// API routes for order trackings
app.get('/api/order_trackings', getOrderTrackings);
app.post('/api/order_trackings', addOrderTracking);
app.put('/api/order_trackings/:id', updateOrderTracking);
app.delete('/api/order_trackings/:id', deleteOrderTracking);

// API routes for payments
app.get('/api/payments', getPayments);
app.post('/api/payments', addPayment);
app.put('/api/payments/:id', updatePayment);
app.delete('/api/payments/:id', deletePayment);

// API routes for notifications
app.get('/api/notifications', getNotifications);
app.post('/api/notifications', addNotification);
app.put('/api/notifications/:id', markNotificationAsRead);
app.delete('/api/notifications/:id', deleteNotification);

app.get('/api/crop_sub_categories', getCropSubCategories)
app.post('/api/crop_sub_categories', addCropSubCategory);
app.put('/api/crop_sub_categories/:id', updateCropSubCategory);
app.delete('/api/crop_sub_categories/:id', deleteCropSubCategory);

app.get('/api/review_images', getReviewImages)
app.post('/api/review_images', addReviewImage);
app.put('/api/review_images/:id', updateReviewImage);
app.delete('/api/review_images/:id', deleteReviewImage);

// Serve frontend files
const distPath = path.join(__dirname, '../frontend/dist/');
app.use(express.static(distPath));

// Catch-all route to serve the frontend
app.get('*', (req, res) => {
    res.sendFile('index.html', { root: distPath });
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('chat message', async (msg) => {
        console.log('Message received:', msg);

        // Optionally save the message to your database
        // const { data, error } = await supabase
        //   .from('chat_messages')
        //   .insert([{ user_id: msg.user_id, message: msg.text }]);

        // Broadcast the message to all connected clients
        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Debugging route to check session data
app.get('/api/debug/session', (req, res) => {
    res.json(req.session);
});
