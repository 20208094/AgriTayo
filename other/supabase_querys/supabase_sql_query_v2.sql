-- Create user_type table
CREATE TABLE user_type (
    user_type_id SERIAL PRIMARY KEY,
    user_type_name VARCHAR(50) NOT NULL,
    user_type_description TEXT
);

-- Create users table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    firstname VARCHAR(50) NOT NULL,
    middlename VARCHAR(50),
    lastname VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    gender VARCHAR(10) CHECK (gender IN ('Male', 'Female', 'Other')),
    birthday DATE,
    user_type_id INT,
    verified BOOLEAN DEFAULT FALSE,
    user_image_url VARCHAR(255),
    FOREIGN KEY (user_type_id) REFERENCES user_type(user_type_id)
);

CREATE INDEX idx_users_user_type_id ON users(user_type_id);

-- Create addresses table with additional columns
CREATE TABLE addresses (
    address_id SERIAL PRIMARY KEY,
    user_id INT,
    address TEXT NOT NULL,
    label VARCHAR(50),
    note TEXT,
    latitude DECIMAL(9, 6),
    longitude DECIMAL(9, 6),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE INDEX idx_addresses_user_id ON addresses(user_id);

-- Create shop table
CREATE TABLE shop (
    shop_id SERIAL PRIMARY KEY,
    shop_name VARCHAR(100) NOT NULL,
    shop_address TEXT,
    shop_description TEXT,
    user_id INT,
    shop_image_url VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
);

CREATE INDEX idx_shop_user_id ON shop(user_id);

-- Create crop_category table
CREATE TABLE crop_category (
    crop_category_id SERIAL PRIMARY KEY,
    crop_category_name VARCHAR(100) NOT NULL,
    crop_category_description TEXT,
    crop_category_image_url VARCHAR(255)
);

-- Create metric_system table
CREATE TABLE metric_system (
    metric_system_id SERIAL PRIMARY KEY,
    metric_system_name VARCHAR(100) NOT NULL,
    metric_val_kilogram DECIMAL(10, 4) NOT NULL,
    metric_val_gram DECIMAL(10, 4) NOT NULL,
    metric_val_pounds DECIMAL(10, 4) NOT NULL
);

-- Create crops table
CREATE TABLE crops (
    crop_id SERIAL PRIMARY KEY,
    crop_name VARCHAR(100) NOT NULL,
    crop_description TEXT,
    category_id INT,
    shop_id INT,
    crop_image_url VARCHAR(255),
    crop_rating DECIMAL(3, 2),
    crop_price DECIMAL(10, 2) NOT NULL,
    crop_quantity INT,
    crop_weight DECIMAL(10, 4),
    metric_system_id INT,
    FOREIGN KEY (category_id) REFERENCES crop_category(crop_category_id) ON DELETE SET NULL,
    FOREIGN KEY (shop_id) REFERENCES shop(shop_id) ON DELETE SET NULL,
    FOREIGN KEY (metric_system_id) REFERENCES metric_system(metric_system_id) ON DELETE SET NULL
);

CREATE INDEX idx_crops_category_id ON crops(category_id);
CREATE INDEX idx_crops_shop_id ON crops(shop_id);
CREATE INDEX idx_crops_metric_system_id ON crops(metric_system_id);

-- Create order_status table
CREATE TABLE order_status (
    order_status_id SERIAL PRIMARY KEY,
    order_status_name VARCHAR(50) NOT NULL,
    order_status_description TEXT
);

-- Create orders table
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    total_price DECIMAL(10, 2) NOT NULL,
    total_weight DECIMAL(10, 4),
    status_id INT,
    user_id INT,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    order_metric_system_id INT,
    FOREIGN KEY (status_id) REFERENCES order_status(order_status_id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    FOREIGN KEY (order_metric_system_id) REFERENCES metric_system(metric_system_id) ON DELETE SET NULL
);

CREATE INDEX idx_orders_status_id ON orders(status_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_metric_system_id ON orders(order_metric_system_id);

-- Create order_products table
CREATE TABLE order_products (
    order_prod_id SERIAL PRIMARY KEY,
    order_id INT,
    order_prod_crop_id INT,
    order_prod_total_weight INT,
    order_prod_total_price DECIMAL(10, 2) NOT NULL,
    order_prod_user_id INT,
    order_prod_metric_system_id INT,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (order_prod_crop_id) REFERENCES crops(crop_id) ON DELETE SET NULL,
    FOREIGN KEY (order_prod_user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    FOREIGN KEY (order_prod_metric_system_id) REFERENCES metric_system(metric_system_id) ON DELETE SET NULL
);

CREATE INDEX idx_order_products_order_id ON order_products(order_id);
CREATE INDEX idx_order_products_crop_id ON order_products(order_prod_crop_id);
CREATE INDEX idx_order_products_user_id ON order_products(order_prod_user_id);
CREATE INDEX idx_order_products_metric_system_id ON order_products(order_prod_metric_system_id);

-- Create cart table
CREATE TABLE cart (
    cart_id SERIAL PRIMARY KEY,
    cart_total_price DECIMAL(10, 2) NOT NULL,
    cart_total_weight DECIMAL(10, 4),
    cart_user_id INT,
    cart_metric_system_id INT,
    FOREIGN KEY (cart_user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (cart_metric_system_id) REFERENCES metric_system(metric_system_id) ON DELETE SET NULL
);

CREATE INDEX idx_cart_user_id ON cart(cart_user_id);
CREATE INDEX idx_cart_metric_system_id ON cart(cart_metric_system_id);

-- Create cart_products table
CREATE TABLE cart_products (
    cart_prod_id SERIAL PRIMARY KEY,
    cart_id INT,
    cart_prod_crop_id INT,
    cart_prod_total_weight INT,
    cart_prod_total_price DECIMAL(10, 2) NOT NULL,
    cart_prod_user_id INT,
    cart_prod_metric_system_id INT,
    FOREIGN KEY (cart_id) REFERENCES cart(cart_id) ON DELETE CASCADE,
    FOREIGN KEY (cart_prod_crop_id) REFERENCES crops(crop_id) ON DELETE SET NULL,
    FOREIGN KEY (cart_prod_user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    FOREIGN KEY (cart_prod_metric_system_id) REFERENCES metric_system(metric_system_id) ON DELETE SET NULL
);

CREATE INDEX idx_cart_products_cart_id ON cart_products(cart_id);
CREATE INDEX idx_cart_products_crop_id ON cart_products(cart_prod_crop_id);
CREATE INDEX idx_cart_products_user_id ON cart_products(cart_prod_user_id);
CREATE INDEX idx_cart_products_metric_system_id ON cart_products(cart_prod_metric_system_id);

-- Create reviews table
CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    crop_id INT,
    user_id INT,
    rating DECIMAL(2, 1) CHECK (rating BETWEEN 1 AND 5),
    review_text TEXT,
    review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (crop_id) REFERENCES crops(crop_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE INDEX idx_reviews_crop_id ON reviews(crop_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);

-- Create review_images table (to handle up to 3 images per review)
CREATE TABLE review_images (
    review_image_id SERIAL PRIMARY KEY,
    review_id INT,
    image_url VARCHAR(255) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (review_id) REFERENCES reviews(review_id) ON DELETE CASCADE
);

CREATE INDEX idx_review_images_review_id ON review_images(review_id);

-- Create order_tracking table
CREATE TABLE order_tracking (
    tracking_id SERIAL PRIMARY KEY,
    order_id INT,
    status VARCHAR(10) CHECK (status IN ('Placed', 'Processed', 'Shipped', 'Delivered', 'Cancelled')),
    update_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);

CREATE INDEX idx_order_tracking_order_id ON order_tracking(order_id);

-- Create payments table
CREATE TABLE payments (
    payment_id SERIAL PRIMARY KEY,
    order_id INT,
    payment_method VARCHAR(50),
    payment_status VARCHAR(10) CHECK (payment_status IN ('Pending', 'Completed', 'Failed')),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    amount DECIMAL(10, 2),
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);

CREATE INDEX idx_payments_order_id ON payments(order_id);

-- Create notifications table
CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id INT,
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    notification_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);


-- Insert user types into the user_type table

INSERT INTO user_type (user_type_name, user_type_description) VALUES
    ('Admin', 'Administrator with full access rights'),
    ('Seller', 'Seller with permissions to manage products and orders'),
    ('Buyer', 'Buyer with permissions to browse and purchase products');

-- Insert users into the users table

INSERT INTO users (
    firstname, middlename, lastname, email, password, phone_number, gender, birthday, user_type_id, verified
) VALUES
    ('Admin', 'A.', 'Adminson', 'admin@gmail.com', '$2b$10$TuNHzdg3GAgbf4x4qDGyheiuiH5xZ7lHeJDgs61gGu0WOtOUF3nH', '123-456-7890', 'Male', '1980-01-01', 1, TRUE),
    ('Seller', 'S.', 'Sellerson', 'seller@gmail.com', '$2b$10$TuNHzdg3GAgbf4x4qDGyheiuiH5xZ7lHeJDgs61gGu0WOtOUF3nH', '234-567-8901', 'Female', '1985-05-15', 2, TRUE),
    ('Buyer', 'B.', 'Buyerson', 'buyer@gmail.com', '$2b$10$TuNHzdg3GAgbf4x4qDGyheiuiH5xZ7lHeJDgs61gGu0WOtOUF3nH', '345-678-9012', 'Other', '1990-10-30', 3, FALSE);

-- Insert crop categories into the crop_category table

INSERT INTO crop_category (crop_category_name, crop_category_description) VALUES
    ('Vegetables', 'Various types of vegetables'),
    ('Fruits', 'Different kinds of fruits'),
    ('Spices', 'Spices used for flavoring'),
    ('Seedlings', 'Young plants or seedlings'),
    ('Plants', 'General plants'),
    ('Flowers', 'Various types of flowers');

-- Insert sample addresses with additional details
INSERT INTO addresses (user_id, address, label, note, latitude, longitude) VALUES
    (1, '123 Admin Street, Admin City, Admin Country', 'Home', 'Primary residence', 40.712776, -74.005974),
    (2, '456 Seller Avenue, Seller Town, Seller Country', 'Office', 'Main office address', 34.052235, -118.243683),
    (3, '789 Buyer Road, Buyer City, Buyer Country', 'Warehouse', 'Storage location', 37.774929, -122.419418);


-- Insert sample shops
INSERT INTO shop (shop_name, shop_address, shop_description, user_id, shop_image_url) VALUES
    ('Admin Shop', '123 Admin Street, Admin City, Admin Country', 'The admins shop for everything.', 1, 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png'),
    ('Sellers Market', '456 Seller Avenue, Seller Town, Seller Country', 'A market managed by the seller.', 2, 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png');

-- Insert sample metric systems
INSERT INTO metric_system (metric_system_name, metric_val_kilogram, metric_val_gram, metric_val_pounds) VALUES
    ('Metric', 1.0000, 1000.0000, 2.2046),
    ('Imperial', 0.4536, 453.5927, 1.0000);

-- Insert sample crops
INSERT INTO crops (
    crop_name, crop_description, category_id, shop_id, crop_image_url, crop_rating, crop_price, crop_quantity, crop_weight, metric_system_id
) VALUES
    ('Tomato', 'Red ripe tomatoes', 1, 2, 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png', 4.5, 2.99, 100, 0.2500, 1),
    ('Apple', 'Juicy red apples', 2, NULL, 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png', 4.8, 1.49, 200, 0.2000, 1);

-- Insert sample order statuses
INSERT INTO order_status (order_status_name, order_status_description) VALUES
    ('Placed', 'Order has been placed and is awaiting processing.'),
    ('Processed', 'Order is being processed.'),
    ('Shipped', 'Order has been shipped.'),
    ('Delivered', 'Order has been delivered.'),
    ('Cancelled', 'Order has been cancelled.');

-- Insert sample orders
INSERT INTO orders (
    total_price, total_weight, status_id, user_id, order_date, order_metric_system_id
) VALUES
    (29.97, 0.4500, 1, 3, '2024-08-15 10:00:00', 1),
    (1.49, 0.2000, 2, 2, '2024-08-15 12:00:00', 1);

-- Insert sample order_products
INSERT INTO order_products (
    order_id, order_prod_crop_id, order_prod_total_weight, order_prod_total_price, order_prod_user_id, order_prod_metric_system_id
) VALUES
    (1, 1, 0.2500, 2.99, 3, 1),
    (2, 2, 0.2000, 1.49, 2, 1);

-- Insert sample carts
INSERT INTO cart (
    cart_total_price, cart_total_weight, cart_user_id, cart_metric_system_id
) VALUES
    (4.48, 0.4500, 3, 1),
    (2.99, 0.2500, 2, 1);

-- Insert sample cart_products
INSERT INTO cart_products (
    cart_id, cart_prod_crop_id, cart_prod_total_weight, cart_prod_total_price, cart_prod_user_id, cart_prod_metric_system_id
) VALUES
    (1, 1, 0.2500, 2.99, 3, 1),
    (2, 2, 0.2000, 1.49, 2, 1);

-- Insert sample reviews
INSERT INTO reviews (
    crop_id, user_id, rating, review_text, review_date
) VALUES
    (1, 3, 5.0, 'Excellent tomatoes, fresh and juicy!', '2024-08-15 09:00:00'),
    (2, 2, 4.0, 'Nice apples, but a bit pricey.', '2024-08-15 11:00:00');

-- Insert sample review images
INSERT INTO review_images (
    review_id, image_url
) VALUES
    (1, 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png'),
    (1, 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png'),
    (2, 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png');

-- Insert sample order_tracking
INSERT INTO order_tracking (
    order_id, status, update_date
) VALUES
    (1, 'Placed', '2024-08-15 10:05:00'),
    (2, 'Shipped', '2024-08-15 12:15:00');

-- Insert sample payments
INSERT INTO payments (
    order_id, payment_method, payment_status, payment_date, amount
) VALUES
    (1, 'Credit Card', 'Completed', '2024-08-15 10:10:00', 29.97),
    (2, 'PayPal', 'Pending', '2024-08-15 12:20:00', 1.49);

-- Insert sample notifications
INSERT INTO notifications (
    user_id, message, is_read, notification_date
) VALUES
    (1, 'Your order has been placed successfully.', FALSE, '2024-08-15 10:00:00'),
    (2, 'Your payment has been processed.', TRUE, '2024-08-15 12:00:00');
