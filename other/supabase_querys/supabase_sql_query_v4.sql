SQL SUPABASE

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
-- CREATE TABLE addresses (
--     address_id SERIAL PRIMARY KEY,
--     user_id INT NOT NULL,
--     house_number VARCHAR(10),
--     street_name VARCHAR(100),
--     building VARCHAR(50),
--     region VARCHAR(50),
--     city VARCHAR(50),
--     province VARCHAR(50),
--     barangay VARCHAR(50),
--     postal_code VARCHAR(10),
--     label VARCHAR(50),
--     note TEXT,
--     latitude DECIMAL(9, 6),
--     longitude DECIMAL(9, 6),
--     FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
-- );

-- CREATE INDEX idx_addresses_user_id ON addresses(user_id);

-- Create shop table
CREATE TABLE shop (
    shop_id SERIAL PRIMARY KEY,
    shop_name VARCHAR(100) NOT NULL,
    shop_address TEXT,
    shop_description TEXT,
    user_id INT,
    shop_image_url VARCHAR(255),
    delivery BOOLEAN DEFAULT FALSE,
    pickup BOOLEAN DEFAULT FALSE,
    delivery_price_min DECIMAL(10, 2),
    pickup_price DECIMAL(10, 2),
    gcash BOOLEAN DEFAULT FALSE,
    cod BOOLEAN DEFAULT FALSE,
    bank BOOLEAN DEFAULT FALSE,
    shop_number VARCHAR(20),
    submit_later BOOLEAN DEFAULT NULL,
    tin_number TEXT,
    bir_image_url TEXT,
    pickup_address TEXT,
    secondary_shop_number VARCHAR(20),
    delivery_price_max DECIMAL(10, 2),
    shop_rating DECIMAL(3, 2),
    shop_total_rating INT,
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
    metric_system_symbol VARCHAR(100) NOT NULL,
    metric_val_kilogram DECIMAL(10, 4) NOT NULL,
    metric_val_gram DECIMAL(10, 4) NOT NULL,
    metric_val_pounds DECIMAL(10, 4) NOT NULL
);

-- Create crop_variety table
CREATE TABLE crop_varieties (
    crop_variety_id SERIAL PRIMARY KEY,
    crop_variety_name VARCHAR(100) NOT NULL,
    crop_variety_description TEXT,
    crop_variety_image_url VARCHAR(255),
    crop_category_id INT NOT NULL,
    crop_sub_category_id INT NOT NULL,
    FOREIGN KEY (crop_category_id) REFERENCES crop_category(crop_category_id) ON DELETE SET NULL,
    FOREIGN KEY (crop_sub_category_id) REFERENCES crop_sub_category(crop_sub_category_id) ON DELETE SET NULL
);

-- Indexes for faster querying
CREATE INDEX idx_crop_variety_crop_category_id ON crop_varieties(crop_category_id);
CREATE INDEX idx_crop_variety_crop_sub_category_id ON crop_varieties(crop_sub_category_id);

-- Create crop_sizes table
CREATE TABLE crop_sizes (
    crop_size_id SERIAL PRIMARY KEY,
    crop_size_name VARCHAR(50) NOT NULL, -- e.g., Small, Medium, Large, Long
    crop_size_type VARCHAR(50) CHECK (crop_size_type IN ('Size','Weight', 'Length', 'Other')), -- Type of size (Weight/Length)
    crop_size_description TEXT -- Optional description for the size
);

-- Create crop_variety_sizes junction table (many-to-many relationship between crop_variety and crop_sizes)
CREATE TABLE crop_variety_sizes (
    crop_variety_size_id SERIAL PRIMARY KEY,
    crop_variety_id INT NOT NULL, -- Reference to crop_variety
    crop_size_id INT NOT NULL, -- Reference to crop_sizes
    FOREIGN KEY (crop_variety_id) REFERENCES crop_varieties(crop_variety_id) ON DELETE CASCADE,
    FOREIGN KEY (crop_size_id) REFERENCES crop_sizes(crop_size_id) ON DELETE CASCADE
);

-- Indexes for faster querying
CREATE INDEX idx_crop_variety_sizes_crop_variety_id ON crop_variety_sizes(crop_variety_id);
CREATE INDEX idx_crop_variety_sizes_crop_size_id ON crop_variety_sizes(crop_size_id);

-- Create crops table
CREATE TABLE crops (
    crop_id SERIAL PRIMARY KEY,
    crop_name VARCHAR(100) NOT NULL,
    crop_description TEXT,
    category_id INT, 
    sub_category_id INT,
    crop_variety_id INT,
    crop_size_id INT,
    shop_id INT,
    crop_image_url VARCHAR(255),
    crop_rating DECIMAL(3, 2),
    crop_price DECIMAL(10, 2) NOT NULL,
    crop_quantity INT,
    crop_class TEXT,
    -- crop_weight DECIMAL(10, 4),
    metric_system_id INT,
    -- stocks INT,
    availability VARCHAR(20) CHECK (availability IN ('live', 'reviewing', 'violation', 'delisted')),
    availability_message TEXT,
    negotiation_allowed BOOLEAN DEFAULT TRUE,
    minimum_negotation INT,
    FOREIGN KEY (sub_category_id) REFERENCES crop_sub_category(crop_sub_category_id) ON DELETE SET NULL,
    FOREIGN KEY (shop_id) REFERENCES shop(shop_id) ON DELETE SET NULL,
    FOREIGN KEY (metric_system_id) REFERENCES metric_system(metric_system_id) ON DELETE SET NULL
);

CREATE INDEX idx_crops_sub_category_id ON crops(sub_category_id);
CREATE INDEX idx_crops_shop_id ON crops(shop_id);
CREATE INDEX idx_crops_metric_system_id ON crops(metric_system_id);

-- OLD CROPS
-- CREATE TABLE crops (
--     crop_id SERIAL PRIMARY KEY,
--     crop_name VARCHAR(100) NOT NULL,
--     crop_description TEXT,
--     sub_category_id INT,
--     shop_id INT,
--     crop_image_url VARCHAR(255),
--     crop_rating DECIMAL(3, 2),
--     crop_price DECIMAL(10, 2) NOT NULL,
--     crop_quantity INT,
--     crop_weight DECIMAL(10, 4),
--     metric_system_id INT,
--     stocks INT,
--     availability VARCHAR(20) CHECK (availability IN ('live', 'reviewing', 'violation', 'delisted')),
--     availability_message TEXT,
--     FOREIGN KEY (sub_category_id) REFERENCES crop_sub_category(crop_sub_category_id) ON DELETE SET NULL,
--     FOREIGN KEY (shop_id) REFERENCES shop(shop_id) ON DELETE SET NULL,
--     FOREIGN KEY (metric_system_id) REFERENCES metric_system(metric_system_id) ON DELETE SET NULL
-- );

-- CREATE INDEX idx_crops_sub_category_id ON crops(sub_category_id);
-- CREATE INDEX idx_crops_shop_id ON crops(shop_id);
-- CREATE INDEX idx_crops_metric_system_id ON crops(metric_system_id);


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
    shop_id INT,
    buyer_is_received BOOLEAN DEFAULT FALSE,
    seller_is_received BOOLEAN DEFAULT FALSE,
    allow_return BOOLEAN DEFAULT NULL,
    order_type VARCHAR(50),
    shipping_method VARCHAR(50),
    payment_method VARCHAR(50),
    reject_reason TEXT,
    return_reason TEXT,
    reject_date TIMESTAMP DEFAULT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    order_received_date TIMESTAMP DEFAULT NULL,
    return_date TIMESTAMP DEFAULT NULL,
    completed_date TIMESTAMP DEFAULT NULL,
    order_metric_system_id INT,
    shipping_address TEXT,
    ratings DECIMAL(2, 1),
    review TEXT,
    FOREIGN KEY (status_id) REFERENCES order_status(order_status_id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    FOREIGN KEY (shop_id) REFERENCES shop(shop_id) ON DELETE SET NULL,
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
    orig_prod_price TEXT,
    orig_prod_metric_symbol TEXT,
    orig_prod_metric_system TEXT,
    orig_prod_shop_id TEXT,
    orig_prod_shop_name TEXT,
    orig_prod_name TEXT,
    orig_prod_description TEXT,
    -- orig_prod_size TEXT,
    orig_prod_class TEXT,
    orig_prod_image_url TEXT,
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

-- Create review_images table
CREATE TABLE review_images (
    review_image_id SERIAL PRIMARY KEY,
    review_id INT,
    image_url VARCHAR(255) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    shop_id INT,
    order_id INT,
    FOREIGN KEY (review_id) REFERENCES reviews(review_id) ON DELETE CASCADE,
    FOREIGN KEY (shop_id) REFERENCES shop(shop_id) ON DELETE SET NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE SET NULL
);

CREATE INDEX idx_review_images_review_id ON review_images(review_id);
CREATE INDEX idx_review_images_shop_id ON review_images(shop_id);
CREATE INDEX idx_review_images_order_id ON review_images(order_id);

-- Create order_tracking table
-- CREATE TABLE order_tracking (
--     tracking_id SERIAL PRIMARY KEY,
--     order_id INT,
--     status VARCHAR(10) CHECK (status IN ('Placed', 'Processed', 'Shipped', 'Delivered', 'Cancelled')),
--     update_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
-- );

-- CREATE INDEX idx_order_tracking_order_id ON order_tracking(order_id);

-- Create payments table
-- CREATE TABLE payments (
--     payment_id SERIAL PRIMARY KEY,
--     order_id INT,
--     payment_method VARCHAR(50),
--     payment_status VARCHAR(10) CHECK (payment_status IN ('Pending', 'Completed', 'Failed')),
--     payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     amount DECIMAL(10, 2),
--     FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
-- );

-- CREATE INDEX idx_payments_order_id ON payments(order_id);

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
    negotiation_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    shop_id INT NOT NULL,
    crop_id INT NOT NULL,
    metric_system_id INT NOT NULL,
    user_price DECIMAL(10, 2) NOT NULL,
    user_amount DECIMAL(10, 2) NOT NULL,
    user_total DECIMAL(10, 2),
    shop_price DECIMAL(10, 2),
    shop_amount DECIMAL(10, 2),
    shop_total DECIMAL(10, 2),
    final_price DECIMAL(10, 2),
    final_amount DECIMAL(10, 2),
    final_total DECIMAL(10, 2),
    user_open_for_negotiation BOOLEAN DEFAULT TRUE,
    shop_open_for_negotiation BOOLEAN DEFAULT TRUE,
    buyer_turn BOOLEAN DEFAULT FALSE,
    negotiation_status VARCHAR(50) DEFAULT 'ongoing',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (metric_system_id) REFERENCES metric_system(metric_system_id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (shop_id) REFERENCES shop(shop_id) ON DELETE CASCADE,
    FOREIGN KEY (crop_id) REFERENCES crops(crop_id) ON DELETE CASCADE,
);

CREATE INDEX idx_negotiations_user_id ON negotiations(user_id);
CREATE INDEX idx_negotiations_shop_id ON negotiations(shop_id);
CREATE INDEX idx_negotiations_metric_system_id ON negotiations(metric_system_id);
CREATE INDEX idx_negotiations_crop_id ON negotiations(crop_id);

-- biddings table
CREATE TABLE biddings (
    bid_id SERIAL PRIMARY KEY,
    shop_id INT NOT NULL,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP,
    bid_image VARCHAR(255),
    bid_description TEXT,
    bid_name VARCHAR(100) NOT NULL,
    bid_category_id INT,
    bid_subcategory_id INT, 
    bid_starting_price DECIMAL(10, 2) NOT NULL,
    bid_minimum_increment DECIMAL(10, 2) NOT NULL,
    bid_current_highest DECIMAL(10, 2) DEFAULT 0,
    bid_user_id INT,
    number_of_bids INT DEFAULT 0,
    bid_ammount INT,
    metric_system_id INT,
    checked_out BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (shop_id) REFERENCES shop(shop_id) ON DELETE CASCADE,
    FOREIGN KEY (bid_subcategory_id) REFERENCES crop_sub_category(crop_sub_category_id) ON DELETE SET NULL,
    FOREIGN KEY (bid_category_id) REFERENCES crop_category (crop_category_id) ON DELETE SET NULL,
    FOREIGN KEY (bid_user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    FOREIGN KEY (metric_system_id) REFERENCES metric_system(metric_system_id) ON DELETE SET NULL,
    FOREIGN KEY (bid_winner_user_id) REFERENCES users(user_id) ON DELETE SET NULL
);

CREATE INDEX idx_biddings_shop_id ON biddings(shop_id);
CREATE INDEX idx_biddings_subcategory_id ON biddings(bid_subcategory_id);
CREATE INDEX idx_biddings_user_id ON biddings(bid_user_id);
CREATE INDEX idx_biddings_metric_system_id ON biddings(metric_system_id);
CREATE INDEX idx_biddings_winner_user_id ON biddings(bid_winner_user_id);


CREATE TABLE user_bids (
    user_bid_id SERIAL PRIMARY KEY,
    bid_id INT NOT NULL,
    user_id INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    bid_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bid_id) REFERENCES biddings(bid_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE INDEX idx_user_bids_bid_id ON user_bids(bid_id);
CREATE INDEX idx_user_bids_user_id ON user_bids(user_id);
