CREATE TABLE user_type (
    user_type_id INT PRIMARY KEY AUTO_INCREMENT,
    user_type_name VARCHAR(50) NOT NULL,
    user_type_description TEXT
);

CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    firstname VARCHAR(50) NOT NULL,
    middlename VARCHAR(50),
    lastname VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    address TEXT,
    gender ENUM('Male', 'Female', 'Other'),
    birthday DATE,
    user_type_id INT,
    verified TINYINT(1) DEFAULT 0,
    FOREIGN KEY (user_type_id) REFERENCES user_type(user_type_id)
);

CREATE TABLE shop (
    shop_id INT PRIMARY KEY AUTO_INCREMENT,
    shop_name VARCHAR(100) NOT NULL,
    shop_address TEXT,
    shop_description TEXT,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE crop_category (
    crop_category_id INT PRIMARY KEY AUTO_INCREMENT,
    crop_category_name VARCHAR(100) NOT NULL,
    crop_category_description TEXT
);

CREATE TABLE metric_system (
    metric_system_id INT PRIMARY KEY AUTO_INCREMENT,
    metric_system_name VARCHAR(100) NOT NULL,
    metric_val_kilogram DECIMAL(10, 4) NOT NULL,
    metric_val_gram DECIMAL(10, 4) NOT NULL,
    metric_val_pounds DECIMAL(10, 4) NOT NULL
);

CREATE TABLE crops (
    crop_id INT PRIMARY KEY AUTO_INCREMENT,
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
    FOREIGN KEY (category_id) REFERENCES crop_category(crop_category_id),
    FOREIGN KEY (shop_id) REFERENCES shop(shop_id),
    FOREIGN KEY (metric_system_id) REFERENCES metric_system(metric_system_id)
);

CREATE TABLE order_status (
    order_status_id INT PRIMARY KEY AUTO_INCREMENT,
    order_status_name VARCHAR(50) NOT NULL,
    order_status_description TEXT
);

CREATE TABLE orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    total_price DECIMAL(10, 2) NOT NULL,
    total_weight DECIMAL(10, 4),
    status_id INT,
    user_id INT,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    order_metric_system_id INT,
    FOREIGN KEY (status_id) REFERENCES order_status(order_status_id),
    FOREIGN KEY (order_metric_system_id) REFERENCES metric_system(metric_system_id)
);

CREATE TABLE order_products (
    order_prod_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT,
    order_prod_crop_id INT,
    order_prod_total_weight INT,
    order_prod_total_price DECIMAL(10, 2) NOT NULL,
    order_prod_user_id INT,
    order_prod_metric_system_id INT,
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (order_prod_crop_id) REFERENCES crops(crop_id),
    FOREIGN KEY (order_prod_user_id) REFERENCES users(user_id),
    FOREIGN KEY (order_prod_metric_system_id) REFERENCES metric_system(metric_system_id)
);

CREATE TABLE cart (
    cart_id INT PRIMARY KEY AUTO_INCREMENT,
    cart_total_price DECIMAL(10, 2) NOT NULL,
    cart_total_weight DECIMAL(10, 4),
    cart_user_id INT,
    cart_metric_system_id INT,
    FOREIGN KEY (cart_user_id) REFERENCES users(user_id),
    FOREIGN KEY (cart_metric_system_id) REFERENCES metric_system(metric_system_id)
);

CREATE TABLE cart_products (
    cart_prod_id INT PRIMARY KEY AUTO_INCREMENT,
    cart_id INT,
    cart_prod_crop_id INT,
    cart_prod_total_weight INT,
    cart_prod_total_price DECIMAL(10, 2) NOT NULL,
    cart_prod_user_id INT,
    cart_prod_metric_system_id INT,
    FOREIGN KEY (cart_id) REFERENCES cart(cart_id),
    FOREIGN KEY (cart_prod_crop_id) REFERENCES crops(crop_id),
    FOREIGN KEY (cart_prod_user_id) REFERENCES users(user_id),
    FOREIGN KEY (cart_prod_metric_system_id) REFERENCES metric_system(metric_system_id)
);
