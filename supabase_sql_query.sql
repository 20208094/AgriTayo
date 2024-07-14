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
    FOREIGN KEY (user_type_id) REFERENCES user_type(user_type_id)
);

CREATE INDEX idx_users_user_type_id ON users(user_type_id);

-- Create addresses table
CREATE TABLE addresses (
    address_id SERIAL PRIMARY KEY,
    user_id INT,
    address TEXT NOT NULL,
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
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
);

CREATE INDEX idx_shop_user_id ON shop(user_id);

-- Create crop_category table
CREATE TABLE crop_category (
    crop_category_id SERIAL PRIMARY KEY,
    crop_category_name VARCHAR(100) NOT NULL,
    crop_category_description TEXT
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
    crop_image VARCHAR(255),
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
