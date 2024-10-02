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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_type_id) REFERENCES user_type(user_type_id)
);

CREATE INDEX idx_users_user_type_id ON users(user_type_id);

-- Create addresses table with additional columns
CREATE TABLE addresses (
    address_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    house_number VARCHAR(10),
    street_name VARCHAR(100),
    building VARCHAR(50),
    region VARCHAR(50),
    city VARCHAR(50),
    province VARCHAR(50),
    barangay VARCHAR(50),
    postal_code VARCHAR(10),
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
    shop_location GEOGRAPHY(POINT, 4326) NOT NULL,
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

-- Create crop_sub_category table
CREATE TABLE crop_sub_category (
    crop_sub_category_id SERIAL PRIMARY KEY,
    crop_sub_category_name VARCHAR(100) NOT NULL,
    crop_sub_category_description TEXT,
    crop_sub_category_image_url VARCHAR(255),
    crop_category_id INT,
    FOREIGN KEY (crop_category_id) REFERENCES crop_category(crop_category_id) ON DELETE SET NULL
);

CREATE INDEX idx_crop_sub_category_crop_category_id ON crop_sub_category(crop_category_id);

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
    sub_category_id INT,
    shop_id INT,
    crop_image_url VARCHAR(255),
    crop_rating DECIMAL(3, 2),
    crop_price DECIMAL(10, 2) NOT NULL,
    crop_quantity INT,
    crop_weight DECIMAL(10, 4),
    metric_system_id INT,
    stocks INT,
    availability VARCHAR(20) CHECK (availability IN ('live', 'reviewing', 'violation', 'delisted')),
    availability_message TEXT,
    FOREIGN KEY (sub_category_id) REFERENCES crop_sub_category(crop_sub_category_id) ON DELETE SET NULL,
    FOREIGN KEY (shop_id) REFERENCES shop(shop_id) ON DELETE SET NULL,
    FOREIGN KEY (metric_system_id) REFERENCES metric_system(metric_system_id) ON DELETE SET NULL
);

CREATE INDEX idx_crops_sub_category_id ON crops(sub_category_id);
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

-- Create Cart Table
CREATE TABLE cart (
    cart_id SERIAL PRIMARY KEY,
    cart_total_price DECIMAL(10, 2) NOT NULL,    
    cart_total_quantity DECIMAL(10, 4),           
    cart_user_id INT,                             
    cart_crop_id INT,         
    cart_metric_system_id INT,
    FOREIGN KEY (cart_user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (cart_crop_id) REFERENCES crops(crop_id) ON DELETE SET NULL,
    FOREIGN KEY (cart_metric_system_id) REFERENCES metric_system(metric_system_id) ON DELETE SET NULL
);

CREATE INDEX idx_cart_user_id ON cart(cart_user_id);
CREATE INDEX idx_cart_metric_system_id ON cart(cart_metric_system_id);
CREATE INDEX idx_cart_crop_id ON cart(cart_crop_id);

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
    title TEXT,
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    notification_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);

-- Create chats table
CREATE TABLE chats (
    chat_id SERIAL PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    receiver_type VARCHAR(10) CHECK (receiver_type IN ('User', 'Shop')),
    sender_type VARCHAR(10) CHECK (sender_type IN ('User', 'Shop')),
    chat_message TEXT,
    chat_image_url VARCHAR(255),
    is_read BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE INDEX idx_chats_sender_id ON chats(sender_id);
CREATE INDEX idx_chats_receiver_id_receiver_type ON chats(receiver_id, receiver_type);

CREATE TABLE negotiations (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    user_id BIGINT REFERENCES users(user_id) ON DELETE CASCADE,
    shop_id BIGINT REFERENCES shop(shop_id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL, -- Assuming you have a products table
    user_price DECIMAL(10, 2) NOT NULL,
    user_amount_kilo DECIMAL(10, 2) NOT NULL,
    user_total DECIMAL(10, 2) GENERATED ALWAYS AS (user_price * user_amount_kilo) STORED,
    shop_price DECIMAL(10, 2),
    shop_total DECIMAL(10, 2) GENERATED ALWAYS AS (shop_price * user_amount_kilo) STORED,
    user_open_for_negotiation BOOLEAN DEFAULT TRUE,
    shop_open_for_negotiation BOOLEAN DEFAULT TRUE,
    status VARCHAR(50) DEFAULT 'negotiating',
    delivery_type VARCHAR(50) CHECK (delivery_type IN ('pickup', 'free delivery', 'paid delivery')) NOT NULL,
    delivery_price DECIMAL(10, 2) DEFAULT 0, -- Only relevant if paid delivery is chosen
    user_address TEXT, -- Address for delivery
    payment_type VARCHAR(50) CHECK (payment_type IN ('COD', 'Gcash')) NOT NULL, -- Payment type chosen by the user
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_negotiations_user_id ON negotiations(user_id);
CREATE INDEX idx_negotiations_shop_id ON negotiations(shop_id);

