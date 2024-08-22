-- Insert user types into the user_type table

INSERT INTO user_type (user_type_name, user_type_description) VALUES
    ('Admin', 'Administrator with full access rights'),
    ('Seller', 'Seller with permissions to manage products and orders'),
    ('Buyer', 'Buyer with permissions to browse and purchase products');

-- Insert users into the users table

INSERT INTO users (
    firstname, middlename, lastname, email, password, phone_number, gender, birthday, user_type_id, verified
) VALUES
    ('Admin', 'A.', 'Adminson', 'admin@gmail.com', '$2b$10$TuNHzdg3GAgbf4x4qDGyheiuiH5xZ7lHeJDgs61gGu0WOtOUF3nH.', '123-456-7890', 'Male', '1980-01-01', 1, TRUE),
    ('Seller', 'S.', 'Sellerson', 'seller@gmail.com', '$2b$10$TuNHzdg3GAgbf4x4qDGyheiuiH5xZ7lHeJDgs61gGu0WOtOUF3nH.', '234-567-8901', 'Female', '1985-05-15', 2, TRUE),
    ('Buyer', 'B.', 'Buyerson', 'buyer@gmail.com', '$2b$10$TuNHzdg3GAgbf4x4qDGyheiuiH5xZ7lHeJDgs61gGu0WOtOUF3nH.', '345-678-9012', 'Other', '1990-10-30', 3, FALSE);

-- Insert crop categories into the crop_category table

INSERT INTO crop_category (crop_category_name, crop_category_description, crop_category_image_url) VALUES
    ('Vegetables', 'Various types of vegetables', 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png'),
    ('Fruits', 'Different kinds of fruits', 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png'),
    ('Spices', 'Spices used for flavoring', 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png'),
    ('Seedlings', 'Young plants or seedlings', 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png'),
    ('Plants', 'General plants', 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png'),
    ('Flowers', 'Various types of flowers', 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png');

INSERT INTO crop_sub_category (crop_sub_category_name, crop_sub_category_description, crop_sub_category_image_url, crop_category_id) VALUES
    ('Carrots', 'Root vegetable, known for its orange color.', 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png', 1),
    ('Potatoes', 'Starchy tuber used in various dishes.', 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png', 1),
    ('Spinach', 'Leafy green vegetable rich in iron.', 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png', 1),
    ('Beets', 'Root vegetable with a sweet taste and vibrant color.', 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png', 1),
    ('Radishes', 'Crunchy root vegetable with a peppery flavor.', 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png', 1),

    ('Apples', 'Sweet, crisp fruit available in various varieties.', 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png', 2),
    ('Bananas', 'Tropical fruit known for its soft texture and sweetness.', 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png', 2),
    ('Oranges', 'Citrus fruit with a tangy flavor and high vitamin C content.', 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png', 2),
    ('Grapes', 'Small, round fruit that can be eaten fresh or used to make wine.', 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png', 2),
    ('Pears', 'Juicy fruit with a sweet, mild flavor.', 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png', 2),

    ('Black Pepper', 'Common spice made from peppercorns.', 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png', 3),
    ('Cumin', 'Spice with a warm, earthy flavor.', 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png', 3),
    ('Turmeric', 'Bright yellow spice used for flavor and color.', 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png', 3),
    ('Ginger', 'Spice with a hot, pungent flavor used in cooking and baking.', 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png', 3),
    ('Paprika', 'Mildly spicy red pepper used as a seasoning.', 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png', 3),

    ('Tomato Seedlings', 'Young plants of tomatoes.', 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png', 4),
    ('Pepper Seedlings', 'Young plants of bell peppers.', 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png', 4),
    ('Lettuce Seedlings', 'Young plants of lettuce.', 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png', 4),
    ('Cucumber Seedlings', 'Young plants of cucumbers.', 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png', 4),
    ('Squash Seedlings', 'Young plants of squash.', 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png', 4),

    ('Houseplants', 'Indoor plants that are easy to care for.', 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png', 5),
    ('Succulents', 'Plants with thick, fleshy parts adapted to dry conditions.', 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png', 5),
    ('Herbs', 'Plants used for culinary or medicinal purposes.', 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png', 5),
    ('Ornamental Plants', 'Plants grown for decorative purposes.', 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png', 5),
    ('Vines', 'Plants with a climbing or trailing growth habit.', 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png', 5),

    ('Sunflowers', 'Tall flowers known for their large yellow blooms.', 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png', 6),
    ('Roses', 'Popular ornamental flower with a variety of colors.', 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png', 6),
    ('Tulips', 'Spring-blooming flowers with a cup-shaped appearance.', 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png', 6),
    ('Lilies', 'Flowering plants with large, prominent flowers.', 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png', 6),
    ('Daisies', 'Flowers known for their simple, cheerful appearance.', 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png', 6);


-- Insert sample addresses with additional details
-- Insert new addresses with updated schema and provided latitude and longitude

INSERT INTO addresses (
    user_id, house_number, street_name, building, region, city, province, barangay, postal_code, label, note, latitude, longitude
) VALUES
    -- Addresses for User 1
    (1, '123', 'Admin Street', NULL, NULL, 'Admin City', NULL, NULL, NULL, 'Home', 'Primary residence', 16.411607887429312, -239.40623044967654),
    (1, '124', 'Admin Lane', 'Building A', 'Central Region', 'Admin City', 'Admin Province', 'Admin Barangay', '10001', 'Office', 'Secondary office address', 16.411607887429312, -239.40623044967654),

    -- Addresses for User 2
    (2, '456', 'Seller Avenue', NULL, NULL, 'Seller Town', NULL, NULL, NULL, 'Office', 'Main office address', 16.411607887429312, -239.40623044967654),
    (2, '457', 'Seller Boulevard', 'Suite 12', 'North Region', 'Seller Town', 'Seller Province', 'Seller Barangay', '90001', 'Warehouse', 'Storage location', 16.411607887429312, -239.40623044967654),

    -- Addresses for User 3
    (3, '789', 'Buyer Road', NULL, NULL, 'Buyer City', NULL, NULL, NULL, 'Warehouse', 'Storage location', 16.411607887429312, -239.40623044967654),
    (3, '790', 'Buyer Street', 'Building B', 'East Region', 'Buyer City', 'Buyer Province', 'Buyer Barangay', '20002', 'Office', 'Administrative office address', 16.411607887429312, -239.40623044967654);

-- Insert sample shops
INSERT INTO shop (shop_name, shop_address, shop_description, user_id, shop_image_url) VALUES
    ('Admin Shop', '123 Admin Street, Admin City, Admin Country', 'The admins shop for everything.', 1, 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png'),
    ('Sellers Market', '456 Seller Avenue, Seller Town, Seller Country', 'A market managed by the seller.', 2, 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png');

-- Insert sample metric systems
INSERT INTO metric_system (metric_system_name, metric_val_kilogram, metric_val_gram, metric_val_pounds) VALUES
    ('Kilogram', 1.0000, 1000.0000, 2.2046),
    ('Pound', 0.4536, 453.5927, 1.0000);

-- Insert sample data into crops table

INSERT INTO crops (crop_name, crop_description, sub_category_id, shop_id, crop_image_url, crop_rating, crop_price, crop_quantity, crop_weight, metric_system_id) VALUES
    ('Carrots', 'Sweet and crunchy root vegetable.', 1, 1, 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png', 4.5, 2.50, 100, 0.5000, 1),
    ('Potatoes', 'Starchy tuber used in various dishes.', 1, 1, 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png', 4.2, 3.00, 150, 0.7000, 1),
    ('Spinach', 'Leafy green vegetable rich in iron.', 1, 1, 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png', 4.7, 1.80, 120, 0.3000, 1),
    ('Beets', 'Sweet root vegetable with vibrant color.', 1, 2, 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png', 4.6, 2.20, 80, 0.4000, 1),
    ('Radishes', 'Crunchy vegetable with a peppery flavor.', 1, 2, 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png', 4.3, 1.50, 90, 0.2000, 1),

    ('Apples', 'Crisp and sweet fruit.', 2, 1, 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png', 4.8, 3.50, 200, 0.2000, 1),
    ('Bananas', 'Sweet tropical fruit.', 2, 1, 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png', 4.6, 2.80, 150, 0.1500, 1),
    ('Oranges', 'Tangy citrus fruit high in vitamin C.', 2, 2, 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png', 4.7, 3.20, 180, 0.2500, 1),
    ('Grapes', 'Small, sweet fruit often used in wine.', 2, 2, 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png', 4.4, 4.00, 100, 0.1000, 1),
    ('Pears', 'Juicy and sweet fruit.', 2, 2, 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png', 4.5, 3.10, 140, 0.2200, 1),

    ('Black Pepper', 'Spice made from peppercorns.', 3, 1, 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png', 4.9, 5.00, 50, 0.0100, 1),
    ('Cumin', 'Spice with a warm, earthy flavor.', 3, 1, 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png', 4.6, 4.50, 60, 0.0120, 1),
    ('Turmeric', 'Bright yellow spice used for flavor and color.', 3, 2, 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png', 4.7, 6.00, 40, 0.0150, 1),
    ('Ginger', 'Spice with a hot, pungent flavor.', 3, 2, 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png', 4.8, 5.50, 50, 0.0200, 1),
    ('Paprika', 'Mildly spicy red pepper used as a seasoning.', 3, 2, 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png', 4.5, 4.00, 70, 0.0180, 1),

    ('Tomato Seedlings', 'Young plants for growing tomatoes.', 4, 1, 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png', 4.3, 7.00, 100, 0.0500, 1),
    ('Pepper Seedlings', 'Young plants of bell peppers.', 4, 1, 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png', 4.4, 8.00, 80, 0.0600, 1),
    ('Lettuce Seedlings', 'Young plants of lettuce.', 4, 2, 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png', 4.2, 6.50, 90, 0.0400, 1),
    ('Cucumber Seedlings', 'Young plants of cucumbers.', 4, 2, 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png', 4.6, 7.50, 70, 0.0550, 1),
    ('Squash Seedlings', 'Young plants of squash.', 4, 1, 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png', 4.5, 6.00, 60, 0.0650, 1),

    ('Houseplants', 'Indoor plants that are easy to care for.', 5, 1, 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png', 4.8, 10.00, 50, 0.2000, 1),
    ('Succulents', 'Plants with thick, fleshy parts adapted to dry conditions.', 5, 1, 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png', 4.7, 9.00, 60, 0.1800, 1),
    ('Herbs', 'Plants used for culinary or medicinal purposes.', 5, 2, 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png', 4.6, 8.00, 70, 0.1500, 1),
    ('Ornamental Plants', 'Plants grown for decorative purposes.', 5, 2, 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png', 4.5, 11.00, 40, 0.2200, 1),
    ('Vines', 'Plants with a climbing or trailing growth habit.', 5, 1, 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png', 4.4, 7.50, 80, 0.2500, 1),

    ('Sunflowers', 'Tall flowers with large yellow blooms.', 6, 1, 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png', 4.9, 15.00, 30, 0.5000, 1),
    ('Roses', 'Popular ornamental flowers available in many colors.', 6, 1, 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png', 4.8, 12.00, 25, 0.3000, 1),
    ('Tulips', 'Spring-blooming flowers with a cup-shaped appearance.', 6, 2, 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png', 4.7, 14.00, 20, 0.2800, 1),
    ('Lilies', 'Flowering plants with large, prominent blooms.', 6, 2, 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png', 4.6, 13.00, 15, 0.3200, 1),
    ('Daisies', 'Simple and cheerful flowers.', 6, 1, 'https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png', 4.5, 10.00, 35, 0.1500, 1);

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
