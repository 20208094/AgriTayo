// Use DBML to define your database structure
// Docs: https://dbml.dbdiagram.io/docs

Table user_type {
  user_type_id integer [primary key]
  user_type_name varchar
  user_type_description text
}

Table users {
  user_id integer [primary key]
  firstname varchar
  middlename varchar
  lastname varchar
  email varchar [unique]
  password varchar
  phone_number varchar
  gender enum('Male', 'Female', 'Other')
  birthday date
  user_type_id integer
  verified boolean
  user_image_url varchar
}

Table addresses {
  address_id integer [primary key]
  user_id integer
  house_number varchar
  street_name varchar
  building varchar
  region varchar
  city varchar
  province varchar
  barangay varchar
  postal_code varchar
  label varchar
  note text
  latitude decimal(9, 6)
  longitude decimal(9, 6)
}

Table shop {
  shop_id integer [primary key]
  shop_name varchar
  shop_address text
  shop_description text
  user_id integer
  shop_image_url varchar
}

Table crop_category {
  crop_category_id integer [primary key]
  crop_category_name varchar
  crop_category_description text
  crop_category_image_url varchar
}

Table crop_sub_category {
  crop_sub_category_id integer [primary key]
  crop_sub_category_name varchar
  crop_sub_category_description text
  crop_sub_category_image_url varchar
  crop_category_id integer
}

Table metric_system {
  metric_system_id integer [primary key]
  metric_system_name varchar
  metric_val_kilogram decimal(10, 4)
  metric_val_gram decimal(10, 4)
  metric_val_pounds decimal(10, 4)
}

Table crops {
  crop_id integer [primary key]
  crop_name varchar
  crop_description text
  sub_category_id integer
  shop_id integer
  crop_image_url varchar
  crop_rating decimal(3, 2)
  crop_price decimal(10, 2)
  crop_quantity integer
  crop_weight decimal(10, 4)
  metric_system_id integer
}

Table order_status {
  order_status_id integer [primary key]
  order_status_name varchar
  order_status_description text
}

Table orders {
  order_id integer [primary key]
  total_price decimal(10, 2)
  total_weight decimal(10, 4)
  status_id integer
  user_id integer
  order_date timestamp
  order_metric_system_id integer
}

Table order_products {
  order_prod_id integer [primary key]
  order_id integer
  order_prod_crop_id integer
  order_prod_total_weight integer
  order_prod_total_price decimal(10, 2)
  order_prod_user_id integer
  order_prod_metric_system_id integer
}

Table cart {
  cart_id integer [primary key]
  cart_total_price decimal(10, 2)
  cart_total_weight decimal(10, 4)
  cart_user_id integer
  cart_metric_system_id integer
}

Table cart_products {
  cart_prod_id integer [primary key]
  cart_id integer
  cart_prod_crop_id integer
  cart_prod_total_weight integer
  cart_prod_total_price decimal(10, 2)
  cart_prod_user_id integer
  cart_prod_metric_system_id integer
}

Table reviews {
  review_id integer [primary key]
  crop_id integer
  user_id integer
  rating decimal(2, 1)
  review_text text
  review_date timestamp
}

Table review_images {
  review_image_id integer [primary key]
  review_id integer
  image_url varchar
  uploaded_at timestamp
}

Table order_tracking {
  tracking_id integer [primary key]
  order_id integer
  status enum('Placed', 'Processed', 'Shipped', 'Delivered', 'Cancelled')
  update_date timestamp
}

Table payments {
  payment_id integer [primary key]
  order_id integer
  payment_method varchar
  payment_status enum('Pending', 'Completed', 'Failed')
  payment_date timestamp
  amount decimal(10, 2)
}

Table notifications {
  notification_id integer [primary key]
  user_id integer
  message text
  is_read boolean
  notification_date timestamp
}

Table chats {
  chat_id integer [primary key]
  sender_id integer
  receiver_id integer
  receiver_type enum('User', 'Shop')
  chat_message text
  chat_image_url varchar
  is_read boolean
  sent_at timestamp
}

// Define relationships
Ref: users.user_type_id > user_type.user_type_id

Ref: addresses.user_id > users.user_id

Ref: shop.user_id > users.user_id

Ref: crop_sub_category.crop_category_id > crop_category.crop_category_id

Ref: crops.sub_category_id > crop_sub_category.crop_sub_category_id

Ref: crops.shop_id > shop.shop_id

Ref: crops.metric_system_id > metric_system.metric_system_id

Ref: orders.status_id > order_status.order_status_id

Ref: orders.user_id > users.user_id

Ref: orders.order_metric_system_id > metric_system.metric_system_id

Ref: order_products.order_id > orders.order_id

Ref: order_products.order_prod_crop_id > crops.crop_id

Ref: order_products.order_prod_user_id > users.user_id

Ref: order_products.order_prod_metric_system_id > metric_system.metric_system_id

Ref: cart.cart_user_id > users.user_id

Ref: cart.cart_metric_system_id > metric_system.metric_system_id

Ref: cart_products.cart_id > cart.cart_id

Ref: cart_products.cart_prod_crop_id > crops.crop_id

Ref: cart_products.cart_prod_user_id > users.user_id

Ref: cart_products.cart_prod_metric_system_id > metric_system.metric_system_id

Ref: reviews.crop_id > crops.crop_id

Ref: reviews.user_id > users.user_id

Ref: review_images.review_id > reviews.review_id

Ref: order_tracking.order_id > orders.order_id

Ref: payments.order_id > orders.order_id

Ref: notifications.user_id > users.user_id

Ref: chats.sender_id > users.user_id

Ref: chats.receiver_id > users.user_id
Ref: chats.receiver_id > shop.user_id
