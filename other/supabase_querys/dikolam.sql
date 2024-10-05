--
-- PostgreSQL database dump
--

-- Dumped from database version 15.6
-- Dumped by pg_dump version 16.4

-- Started on 2024-10-04 19:29:47

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 30 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- TOC entry 4990 (class 0 OID 0)
-- Dependencies: 30
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- TOC entry 1329 (class 1255 OID 34122)
-- Name: get_shops_with_coordinates(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_shops_with_coordinates() RETURNS TABLE(shop_id integer, shop_name text, shop_address text, latitude double precision, longitude double precision)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.shop_id,       -- Qualify with table alias
        s.shop_name,
        s.shop_address,
        ST_Y(ST_Transform(s.shop_location, 4326)) AS latitude,
        ST_X(ST_Transform(s.shop_location, 4326)) AS longitude
    FROM 
        shop s;         -- Use an alias for the shop table
END;
$$;


ALTER FUNCTION public.get_shops_with_coordinates() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 323 (class 1259 OID 32101)
-- Name: addresses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.addresses (
    address_id integer NOT NULL,
    user_id integer NOT NULL,
    house_number character varying(10),
    street_name character varying(100),
    building character varying(50),
    region character varying(50),
    city character varying(50),
    province character varying(50),
    barangay character varying(50),
    postal_code character varying(10),
    label character varying(50),
    note text,
    latitude numeric(9,6),
    longitude numeric(9,6),
    address_location public.geography(Point,4326) DEFAULT '0101000020E610000000000000000000000000000000000000'::public.geography NOT NULL
);


ALTER TABLE public.addresses OWNER TO postgres;

--
-- TOC entry 322 (class 1259 OID 32100)
-- Name: addresses_address_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.addresses_address_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.addresses_address_id_seq OWNER TO postgres;

--
-- TOC entry 4994 (class 0 OID 0)
-- Dependencies: 322
-- Name: addresses_address_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.addresses_address_id_seq OWNED BY public.addresses.address_id;


--
-- TOC entry 360 (class 1259 OID 41428)
-- Name: cart; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart (
    cart_id integer NOT NULL,
    cart_total_price numeric(10,2) NOT NULL,
    cart_total_quantity numeric(10,4),
    cart_user_id integer,
    cart_crop_id integer,
    cart_metric_system_id integer
);


ALTER TABLE public.cart OWNER TO postgres;

--
-- TOC entry 359 (class 1259 OID 41427)
-- Name: cart_cart_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cart_cart_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cart_cart_id_seq OWNER TO postgres;

--
-- TOC entry 4997 (class 0 OID 0)
-- Dependencies: 359
-- Name: cart_cart_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cart_cart_id_seq OWNED BY public.cart.cart_id;


--
-- TOC entry 351 (class 1259 OID 32597)
-- Name: chats; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chats (
    chat_id integer NOT NULL,
    sender_id integer NOT NULL,
    receiver_id integer NOT NULL,
    receiver_type character varying(10),
    chat_message text,
    chat_image_url character varying(255),
    is_read boolean DEFAULT false,
    sent_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    sender_type text DEFAULT ''::text,
    CONSTRAINT chats_receiver_type_check CHECK (((receiver_type)::text = ANY ((ARRAY['User'::character varying, 'Shop'::character varying])::text[])))
);


ALTER TABLE public.chats OWNER TO postgres;

--
-- TOC entry 350 (class 1259 OID 32596)
-- Name: chats_chat_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.chats_chat_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.chats_chat_id_seq OWNER TO postgres;

--
-- TOC entry 5000 (class 0 OID 0)
-- Dependencies: 350
-- Name: chats_chat_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.chats_chat_id_seq OWNED BY public.chats.chat_id;


--
-- TOC entry 327 (class 1259 OID 32131)
-- Name: crop_category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.crop_category (
    crop_category_id integer NOT NULL,
    crop_category_name character varying(100) NOT NULL,
    crop_category_description text,
    crop_category_image_url character varying(255)
);


ALTER TABLE public.crop_category OWNER TO postgres;

--
-- TOC entry 326 (class 1259 OID 32130)
-- Name: crop_category_crop_category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.crop_category_crop_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.crop_category_crop_category_id_seq OWNER TO postgres;

--
-- TOC entry 5003 (class 0 OID 0)
-- Dependencies: 326
-- Name: crop_category_crop_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.crop_category_crop_category_id_seq OWNED BY public.crop_category.crop_category_id;


--
-- TOC entry 329 (class 1259 OID 32140)
-- Name: crop_sub_category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.crop_sub_category (
    crop_sub_category_id integer NOT NULL,
    crop_sub_category_name character varying(100) NOT NULL,
    crop_sub_category_description text,
    crop_sub_category_image_url character varying(255),
    crop_category_id integer
);


ALTER TABLE public.crop_sub_category OWNER TO postgres;

--
-- TOC entry 328 (class 1259 OID 32139)
-- Name: crop_sub_category_crop_sub_category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.crop_sub_category_crop_sub_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.crop_sub_category_crop_sub_category_id_seq OWNER TO postgres;

--
-- TOC entry 5006 (class 0 OID 0)
-- Dependencies: 328
-- Name: crop_sub_category_crop_sub_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.crop_sub_category_crop_sub_category_id_seq OWNED BY public.crop_sub_category.crop_sub_category_id;


--
-- TOC entry 333 (class 1259 OID 32162)
-- Name: crops; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.crops (
    crop_id integer NOT NULL,
    crop_name character varying(100) NOT NULL,
    crop_description text,
    sub_category_id integer,
    shop_id integer,
    crop_image_url character varying(255),
    crop_rating numeric(3,2),
    crop_price numeric(10,2) NOT NULL,
    crop_quantity integer,
    crop_weight numeric(10,4),
    metric_system_id integer
);


ALTER TABLE public.crops OWNER TO postgres;

--
-- TOC entry 332 (class 1259 OID 32161)
-- Name: crops_crop_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.crops_crop_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.crops_crop_id_seq OWNER TO postgres;

--
-- TOC entry 5009 (class 0 OID 0)
-- Dependencies: 332
-- Name: crops_crop_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.crops_crop_id_seq OWNED BY public.crops.crop_id;


--
-- TOC entry 331 (class 1259 OID 32155)
-- Name: metric_system; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.metric_system (
    metric_system_id integer NOT NULL,
    metric_system_name character varying(100) NOT NULL,
    metric_val_kilogram numeric(10,4) NOT NULL,
    metric_val_gram numeric(10,4) NOT NULL,
    metric_val_pounds numeric(10,4) NOT NULL,
    metric_system_symbol text
);


ALTER TABLE public.metric_system OWNER TO postgres;

--
-- TOC entry 330 (class 1259 OID 32154)
-- Name: metric_system_metric_system_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.metric_system_metric_system_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.metric_system_metric_system_id_seq OWNER TO postgres;

--
-- TOC entry 5012 (class 0 OID 0)
-- Dependencies: 330
-- Name: metric_system_metric_system_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.metric_system_metric_system_id_seq OWNED BY public.metric_system.metric_system_id;


--
-- TOC entry 349 (class 1259 OID 32372)
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    notification_id integer NOT NULL,
    user_id integer,
    message text,
    is_read boolean DEFAULT false,
    notification_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    title text
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- TOC entry 348 (class 1259 OID 32371)
-- Name: notifications_notification_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notifications_notification_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notifications_notification_id_seq OWNER TO postgres;

--
-- TOC entry 5015 (class 0 OID 0)
-- Dependencies: 348
-- Name: notifications_notification_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notifications_notification_id_seq OWNED BY public.notifications.notification_id;


--
-- TOC entry 339 (class 1259 OID 32224)
-- Name: order_products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_products (
    order_prod_id integer NOT NULL,
    order_id integer,
    order_prod_crop_id integer,
    order_prod_total_weight integer,
    order_prod_total_price numeric(10,2) NOT NULL,
    order_prod_user_id integer,
    order_prod_metric_system_id integer
);


ALTER TABLE public.order_products OWNER TO postgres;

--
-- TOC entry 338 (class 1259 OID 32223)
-- Name: order_products_order_prod_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_products_order_prod_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_products_order_prod_id_seq OWNER TO postgres;

--
-- TOC entry 5018 (class 0 OID 0)
-- Dependencies: 338
-- Name: order_products_order_prod_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_products_order_prod_id_seq OWNED BY public.order_products.order_prod_id;


--
-- TOC entry 335 (class 1259 OID 32189)
-- Name: order_status; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_status (
    order_status_id integer NOT NULL,
    order_status_name character varying(50) NOT NULL,
    order_status_description text
);


ALTER TABLE public.order_status OWNER TO postgres;

--
-- TOC entry 334 (class 1259 OID 32188)
-- Name: order_status_order_status_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_status_order_status_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_status_order_status_id_seq OWNER TO postgres;

--
-- TOC entry 5021 (class 0 OID 0)
-- Dependencies: 334
-- Name: order_status_order_status_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_status_order_status_id_seq OWNED BY public.order_status.order_status_id;


--
-- TOC entry 345 (class 1259 OID 32342)
-- Name: order_tracking; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_tracking (
    tracking_id integer NOT NULL,
    order_id integer,
    status character varying(10),
    update_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT order_tracking_status_check CHECK (((status)::text = ANY ((ARRAY['Placed'::character varying, 'Processed'::character varying, 'Shipped'::character varying, 'Delivered'::character varying, 'Cancelled'::character varying])::text[])))
);


ALTER TABLE public.order_tracking OWNER TO postgres;

--
-- TOC entry 344 (class 1259 OID 32341)
-- Name: order_tracking_tracking_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_tracking_tracking_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_tracking_tracking_id_seq OWNER TO postgres;

--
-- TOC entry 5024 (class 0 OID 0)
-- Dependencies: 344
-- Name: order_tracking_tracking_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_tracking_tracking_id_seq OWNED BY public.order_tracking.tracking_id;


--
-- TOC entry 337 (class 1259 OID 32198)
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    order_id integer NOT NULL,
    total_price numeric(10,2) NOT NULL,
    total_weight numeric(10,4),
    status_id integer,
    user_id integer,
    order_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    order_metric_system_id integer
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- TOC entry 336 (class 1259 OID 32197)
-- Name: orders_order_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orders_order_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orders_order_id_seq OWNER TO postgres;

--
-- TOC entry 5027 (class 0 OID 0)
-- Dependencies: 336
-- Name: orders_order_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_order_id_seq OWNED BY public.orders.order_id;


--
-- TOC entry 347 (class 1259 OID 32357)
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    payment_id integer NOT NULL,
    order_id integer,
    payment_method character varying(50),
    payment_status character varying(10),
    payment_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    amount numeric(10,2),
    CONSTRAINT payments_payment_status_check CHECK (((payment_status)::text = ANY ((ARRAY['Pending'::character varying, 'Completed'::character varying, 'Failed'::character varying])::text[])))
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- TOC entry 346 (class 1259 OID 32356)
-- Name: payments_payment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payments_payment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payments_payment_id_seq OWNER TO postgres;

--
-- TOC entry 5030 (class 0 OID 0)
-- Dependencies: 346
-- Name: payments_payment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payments_payment_id_seq OWNED BY public.payments.payment_id;


--
-- TOC entry 343 (class 1259 OID 32328)
-- Name: review_images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.review_images (
    review_image_id integer NOT NULL,
    review_id integer,
    image_url character varying(255) NOT NULL,
    uploaded_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.review_images OWNER TO postgres;

--
-- TOC entry 342 (class 1259 OID 32327)
-- Name: review_images_review_image_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.review_images_review_image_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.review_images_review_image_id_seq OWNER TO postgres;

--
-- TOC entry 5033 (class 0 OID 0)
-- Dependencies: 342
-- Name: review_images_review_image_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.review_images_review_image_id_seq OWNED BY public.review_images.review_image_id;


--
-- TOC entry 341 (class 1259 OID 32305)
-- Name: reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reviews (
    review_id integer NOT NULL,
    crop_id integer,
    user_id integer,
    rating numeric(2,1),
    review_text text,
    review_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT reviews_rating_check CHECK (((rating >= (1)::numeric) AND (rating <= (5)::numeric)))
);


ALTER TABLE public.reviews OWNER TO postgres;

--
-- TOC entry 340 (class 1259 OID 32304)
-- Name: reviews_review_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reviews_review_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reviews_review_id_seq OWNER TO postgres;

--
-- TOC entry 5036 (class 0 OID 0)
-- Dependencies: 340
-- Name: reviews_review_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reviews_review_id_seq OWNED BY public.reviews.review_id;


--
-- TOC entry 325 (class 1259 OID 32116)
-- Name: shop; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shop (
    shop_id integer NOT NULL,
    shop_name character varying(100) NOT NULL,
    shop_address text,
    shop_description text,
    user_id integer,
    shop_image_url character varying(255),
    shop_location public.geometry(Point,4326)
);


ALTER TABLE public.shop OWNER TO postgres;

--
-- TOC entry 324 (class 1259 OID 32115)
-- Name: shop_shop_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.shop_shop_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.shop_shop_id_seq OWNER TO postgres;

--
-- TOC entry 5039 (class 0 OID 0)
-- Dependencies: 324
-- Name: shop_shop_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.shop_shop_id_seq OWNED BY public.shop.shop_id;


--
-- TOC entry 358 (class 1259 OID 34247)
-- Name: shop_with_coordinates; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.shop_with_coordinates AS
 SELECT s.shop_id,
    s.shop_name,
    s.shop_description,
    s.shop_address,
    s.user_id,
    s.shop_image_url,
    public.st_y(public.st_transform(s.shop_location, 4326)) AS latitude,
    public.st_x(public.st_transform(s.shop_location, 4326)) AS longitude
   FROM public.shop s;


ALTER VIEW public.shop_with_coordinates OWNER TO postgres;

--
-- TOC entry 357 (class 1259 OID 34192)
-- Name: shop_with_coords; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.shop_with_coords AS
 SELECT s.shop_id,
    s.shop_name,
    s.shop_address,
    s.user_id,
    s.shop_image_url,
    public.st_y(public.st_transform(s.shop_location, 4326)) AS latitude,
    public.st_x(public.st_transform(s.shop_location, 4326)) AS longitude
   FROM public.shop s;


ALTER VIEW public.shop_with_coords OWNER TO postgres;

--
-- TOC entry 319 (class 1259 OID 32073)
-- Name: user_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_type (
    user_type_id integer NOT NULL,
    user_type_name character varying(50) NOT NULL,
    user_type_description text
);


ALTER TABLE public.user_type OWNER TO postgres;

--
-- TOC entry 318 (class 1259 OID 32072)
-- Name: user_type_user_type_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_type_user_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_type_user_type_id_seq OWNER TO postgres;

--
-- TOC entry 5044 (class 0 OID 0)
-- Dependencies: 318
-- Name: user_type_user_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_type_user_type_id_seq OWNED BY public.user_type.user_type_id;


--
-- TOC entry 321 (class 1259 OID 32082)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    firstname character varying(50) NOT NULL,
    middlename character varying(50),
    lastname character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(100) NOT NULL,
    phone_number character varying(20),
    gender character varying(10),
    birthday date,
    user_type_id integer,
    verified boolean DEFAULT false,
    user_image_url character varying(255),
    created_at timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text),
    updated_at timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text),
    CONSTRAINT users_gender_check CHECK (((gender)::text = ANY ((ARRAY['Male'::character varying, 'Female'::character varying, 'Other'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 320 (class 1259 OID 32081)
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_user_id_seq OWNER TO postgres;

--
-- TOC entry 5047 (class 0 OID 0)
-- Dependencies: 320
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- TOC entry 4670 (class 2604 OID 32104)
-- Name: addresses address_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.addresses ALTER COLUMN address_id SET DEFAULT nextval('public.addresses_address_id_seq'::regclass);


--
-- TOC entry 4696 (class 2604 OID 41431)
-- Name: cart cart_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart ALTER COLUMN cart_id SET DEFAULT nextval('public.cart_cart_id_seq'::regclass);


--
-- TOC entry 4692 (class 2604 OID 32600)
-- Name: chats chat_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chats ALTER COLUMN chat_id SET DEFAULT nextval('public.chats_chat_id_seq'::regclass);


--
-- TOC entry 4673 (class 2604 OID 32134)
-- Name: crop_category crop_category_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.crop_category ALTER COLUMN crop_category_id SET DEFAULT nextval('public.crop_category_crop_category_id_seq'::regclass);


--
-- TOC entry 4674 (class 2604 OID 32143)
-- Name: crop_sub_category crop_sub_category_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.crop_sub_category ALTER COLUMN crop_sub_category_id SET DEFAULT nextval('public.crop_sub_category_crop_sub_category_id_seq'::regclass);


--
-- TOC entry 4676 (class 2604 OID 32165)
-- Name: crops crop_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.crops ALTER COLUMN crop_id SET DEFAULT nextval('public.crops_crop_id_seq'::regclass);


--
-- TOC entry 4675 (class 2604 OID 32158)
-- Name: metric_system metric_system_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.metric_system ALTER COLUMN metric_system_id SET DEFAULT nextval('public.metric_system_metric_system_id_seq'::regclass);


--
-- TOC entry 4689 (class 2604 OID 32375)
-- Name: notifications notification_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications ALTER COLUMN notification_id SET DEFAULT nextval('public.notifications_notification_id_seq'::regclass);


--
-- TOC entry 4680 (class 2604 OID 32227)
-- Name: order_products order_prod_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_products ALTER COLUMN order_prod_id SET DEFAULT nextval('public.order_products_order_prod_id_seq'::regclass);


--
-- TOC entry 4677 (class 2604 OID 32192)
-- Name: order_status order_status_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_status ALTER COLUMN order_status_id SET DEFAULT nextval('public.order_status_order_status_id_seq'::regclass);


--
-- TOC entry 4685 (class 2604 OID 32345)
-- Name: order_tracking tracking_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_tracking ALTER COLUMN tracking_id SET DEFAULT nextval('public.order_tracking_tracking_id_seq'::regclass);


--
-- TOC entry 4678 (class 2604 OID 32201)
-- Name: orders order_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders ALTER COLUMN order_id SET DEFAULT nextval('public.orders_order_id_seq'::regclass);


--
-- TOC entry 4687 (class 2604 OID 32360)
-- Name: payments payment_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments ALTER COLUMN payment_id SET DEFAULT nextval('public.payments_payment_id_seq'::regclass);


--
-- TOC entry 4683 (class 2604 OID 32331)
-- Name: review_images review_image_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review_images ALTER COLUMN review_image_id SET DEFAULT nextval('public.review_images_review_image_id_seq'::regclass);


--
-- TOC entry 4681 (class 2604 OID 32308)
-- Name: reviews review_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews ALTER COLUMN review_id SET DEFAULT nextval('public.reviews_review_id_seq'::regclass);


--
-- TOC entry 4672 (class 2604 OID 32119)
-- Name: shop shop_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shop ALTER COLUMN shop_id SET DEFAULT nextval('public.shop_shop_id_seq'::regclass);


--
-- TOC entry 4665 (class 2604 OID 32076)
-- Name: user_type user_type_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_type ALTER COLUMN user_type_id SET DEFAULT nextval('public.user_type_user_type_id_seq'::regclass);


--
-- TOC entry 4666 (class 2604 OID 32085)
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- TOC entry 4954 (class 0 OID 32101)
-- Dependencies: 323
-- Data for Name: addresses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.addresses (address_id, user_id, house_number, street_name, building, region, city, province, barangay, postal_code, label, note, latitude, longitude, address_location) FROM stdin;
4	2	457	Seller Boulevard	Suite 12	CAR	Seller Town	Seller Province	Seller Barangay	90001	Warehouse	Storage location	16.411608	-239.406230	0101000020E610000000000000000000000000000000000000
3	2	456	Seller Avenue	\N	CAR	Seller Town	\N	\N	\N	Office	Main office address	16.411608	-239.406230	0101000020E610000000000000000000000000000000000000
6	16	790	Buyer Street	Building B	CAR	Buyer City	Buyer Province	Barangay Rafael	20002	Home	Administrative office address	16.411608	-239.406230	0101000020E610000000000000000000000000000000000000
5	16	789	Buyer Road	\N	CAR	Buyer City	\N	Baranggay Michael	\N	Office	Storage location	16.300000	-239.406230	0101000020E610000000000000000000000000000000000000
\.


--
-- TOC entry 4984 (class 0 OID 41428)
-- Dependencies: 360
-- Data for Name: cart; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart (cart_id, cart_total_price, cart_total_quantity, cart_user_id, cart_crop_id, cart_metric_system_id) FROM stdin;
2	150.00	5.0000	16	4	1
4	16.80	7.0000	16	2	1
3	60.00	10.0000	16	1	1
1	500.00	50.0000	16	1	1
\.


--
-- TOC entry 4982 (class 0 OID 32597)
-- Dependencies: 351
-- Data for Name: chats; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chats (chat_id, sender_id, receiver_id, receiver_type, chat_message, chat_image_url, is_read, sent_at, sender_type) FROM stdin;
499	1	3	User	test	\N	f	2024-09-29 22:58:52.46284	User
539	1	16	User	test	\N	f	2024-09-30 20:31:49	User
537	1	15	User	test	\N	f	2024-09-30 02:31:43.174338	User
538	1	19	User	test	\N	f	2024-09-30 02:31:46.578374	User
450	1	13	User	hello	\N	f	2024-09-22 21:32:00.075014	User
582	1	2	User	test	\N	f	2024-10-01 00:58:13.869635	
483	3	1	User	oy	\N	t	2024-09-23 02:33:48.31983	User
478	3	1	User	test	\N	t	2024-09-23 02:17:45.772979	User
485	3	1	User	test	\N	t	2024-09-23 02:53:53.52015	User
481	3	1	User	test	\N	t	2024-09-23 02:30:50.081457	User
447	3	1	User	test	\N	t	2024-09-22 01:03:03.966924	User
456	3	1	User		\N	t	2024-09-23 00:02:07.587796	User
461	3	1	User	test	\N	t	2024-09-23 00:34:32.404219	User
482	3	1	User	test	\N	t	2024-09-23 02:32:20.341161	User
493	1	3	User	Happy Birthday Michael	\N	f	2024-09-27 03:49:20.969256	User
492	3	1	User	test	\N	t	2024-09-23 03:15:41.491751	User
551	1	15	User	hellow	\N	f	2024-09-30 20:20:12.018403	User
528	2	1	User	test	\N	t	2024-09-29 23:45:29.630671	User
372	2	1	User	g	\N	t	2024-09-21 23:24:40.063484	User
408	2	1	User	asdasd	\N	t	2024-09-22 00:22:05.714579	User
467	1	1	User		\N	t	2024-09-23 00:51:19.608045	User
520	1	3	User	a	\N	f	2024-09-29 23:39:26.711059	User
556	1	3	User	3	\N	f	2024-09-30 22:37:16.057454	User
561	1	16	User	a	\N	f	2024-10-01 00:17:11.62918	User
566	1	24	User	hi	\N	f	2024-10-01 00:35:46.662642	
568	1	24	User	yow	\N	f	2024-10-01 00:36:25.484756	
384	2	1	User	a	\N	t	2024-09-21 23:46:43.765437	User
385	2	1	User	asdf	\N	t	2024-09-21 23:46:48.499252	User
386	2	1	User	aaa	\N	t	2024-09-21 23:46:55.051605	User
404	2	1	User	as	\N	t	2024-09-22 00:19:46.570377	User
548	2	1	User	hi	\N	t	2024-09-30 03:39:04.72807	User
573	1	15	User	a	\N	f	2024-10-01 00:47:18.347951	User
405	2	1	User	asd	\N	t	2024-09-22 00:19:53.498389	User
448	2	1	User	a	\N	t	2024-09-22 03:00:56.495769	User
359	1	3	User	hello	\N	t	2024-09-21 23:04:11.953053	User
360	1	3	User	aaaaa	\N	t	2024-09-21 23:04:18.955834	User
362	1	3	User	test	\N	t	2024-09-21 23:06:15.032185	User
368	1	3	User		https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/1726931660702.jpg	t	2024-09-21 23:14:24.672003	User
371	1	3	User	eee	\N	t	2024-09-21 23:23:27.520158	User
381	1	3	User	asdf	\N	t	2024-09-21 23:35:26.762474	User
388	1	3	User	a	\N	t	2024-09-21 23:57:34.348145	User
382	1	3	User	ggg	\N	t	2024-09-21 23:35:38.073573	User
389	1	3	User	a	\N	t	2024-09-21 23:57:51.831215	User
477	1	3	User	test	\N	t	2024-09-23 02:15:57.661195	User
490	1	3	User	test	\N	t	2024-09-23 03:09:02.309367	User
491	1	3	User	TEST	\N	t	2024-09-23 03:14:37.574681	User
496	2	1	User	a	\N	t	2024-09-27 10:09:43.916413	User
503	2	1	User	test	\N	t	2024-09-29 23:18:29.668953	User
513	2	1	User	test	\N	t	2024-09-29 23:34:28.839199	User
511	2	1	User	test	\N	t	2024-09-29 23:30:30.615886	User
516	2	1	User	a	\N	t	2024-09-29 23:35:35.079009	User
514	2	1	User	a	\N	t	2024-09-29 23:35:19.445901	User
487	3	1	User	test	\N	t	2024-09-23 03:01:39.461983	User
489	3	1	User	test	\N	t	2024-09-23 03:08:31.18476	User
523	2	1	User	a	\N	t	2024-09-29 23:40:57.080632	User
527	2	1	User	test	\N	t	2024-09-29 23:42:02.420889	User
463	1	3	User		https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/1727022896435.jpg	t	2024-09-23 00:34:59.95934	User
449	1	3	User	a	\N	t	2024-09-22 21:05:47.914886	User
525	2	1	User	a	\N	t	2024-09-29 23:41:03.779052	User
472	1	3	User	asd	\N	t	2024-09-23 01:04:41.755826	User
488	1	3	User	test	\N	t	2024-09-23 03:02:44.778074	User
515	2	1	User	a	\N	t	2024-09-29 23:35:28.816728	User
521	1	2	User	a	\N	t	2024-09-29 23:40:49.646193	User
378	1	2	User	asdasdasd	\N	t	2024-09-21 23:31:58.244552	User
396	1	2	User	asd	\N	t	2024-09-22 00:01:49.519285	User
415	1	2	User	asd	\N	t	2024-09-22 00:26:13.653932	User
417	1	2	User	a	\N	t	2024-09-22 00:28:16.994064	User
422	1	2	User	gaga	\N	t	2024-09-22 00:32:53.546151	User
400	1	2	User	aaaaaa	\N	t	2024-09-22 00:19:16.440602	User
429	1	2	User	as	\N	t	2024-09-22 00:36:22.761954	User
544	1	2	User	a	\N	t	2024-09-30 03:24:42.867316	User
443	1	2	User	asd	\N	t	2024-09-22 00:54:17.951364	User
517	1	2	User	test	\N	t	2024-09-29 23:37:39.064743	User
530	1	2	User	test	\N	t	2024-09-29 23:51:54.58076	User
578	1	2	User	v	\N	t	2024-10-01 00:53:46.175775	User
532	1	2	User	asd	\N	t	2024-09-30 01:39:03.371709	User
524	1	2	User	a	\N	t	2024-09-29 23:41:02.119924	User
526	1	2	User	test	\N	t	2024-09-29 23:41:43.822355	User
549	1	2	User	aa	\N	t	2024-09-30 03:39:56.570575	User
509	1	2	User	test	\N	t	2024-09-29 23:23:15.301481	User
580	1	2	User	g	\N	t	2024-10-01 00:56:05.576071	User
543	2	1	User	test	\N	t	2024-09-30 02:56:22.423534	User
361	1	13	User	aaaa	\N	f	2024-09-21 23:04:34.024171	User
583	1	24	User	a	\N	f	2024-10-02 02:10:34.780879	User
552	1	16	User	a	\N	f	2024-09-30 20:20:29.742247	User
468	1	1	User		https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/1727024525916.jpg	t	2024-09-23 01:02:09.269537	User
557	1	3	User	hello	\N	f	2024-09-30 22:40:58.245702	User
457	3	1	User	test	\N	t	2024-09-23 00:02:27.413968	User
479	3	1	User	test	\N	t	2024-09-23 02:28:01.294265	User
480	3	1	User	test	\N	t	2024-09-23 02:28:18.695863	User
484	3	1	User	test	\N	t	2024-09-23 02:53:13.923485	User
562	1	24	User	hi	\N	f	2024-10-01 00:35:41.644234	
567	1	24	User	hi	\N	f	2024-10-01 00:35:57.167611	
390	1	3	User	a	\N	t	2024-09-21 23:59:08.511608	User
569	1	16	User	b	\N	f	2024-10-01 00:43:58.730844	User
383	1	3	User	k	\N	t	2024-09-21 23:36:14.449527	User
574	1	3	User	b	\N	f	2024-10-01 00:48:38.564134	User
451	1	3	User	asdasd	\N	t	2024-09-22 23:45:30.427367	User
462	1	3	User	test	\N	t	2024-09-23 00:34:42.881362	User
373	2	1	User	aaa	\N	t	2024-09-21 23:25:40.322469	User
494	2	1	User	hello	\N	t	2024-09-27 10:06:13.439825	User
379	2	1	User	asdf	\N	t	2024-09-21 23:33:27.344359	User
387	2	1	User	asdfa	\N	t	2024-09-21 23:47:01.756014	User
504	2	1	User	test	\N	t	2024-09-29 23:21:40.871424	User
403	2	1	User	asdf	\N	t	2024-09-22 00:19:39.637642	User
512	2	1	User	test	\N	t	2024-09-29 23:32:47.051287	User
446	2	1	User	a	\N	t	2024-09-22 00:56:20.518762	User
473	1	3	User	test	\N	t	2024-09-23 01:36:14.554828	User
486	1	3	User		https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/1727031267622.jpg	t	2024-09-23 02:54:31.040409	User
500	1	3	User	test	\N	f	2024-09-29 23:05:32.295196	User
545	2	1	User	a	\N	t	2024-09-30 03:24:55.32927	User
507	2	1	User	why	\N	t	2024-09-29 23:22:14.947115	User
533	1	2	User		https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/1727632016807.jpg	t	2024-09-30 01:46:50.884087	User
434	1	2	User	asd	\N	t	2024-09-22 00:38:43.605914	User
550	1	15	User	h	\N	f	2024-09-30 20:19:24.009479	User
440	1	2	User	as	\N	t	2024-09-22 00:53:39.91119	User
411	1	2	User	asd	\N	t	2024-09-22 00:24:23.583343	User
421	1	2	User	aaaaaaaa	\N	t	2024-09-22 00:29:49.077538	User
581	1	2	User	a	\N	t	2024-10-01 00:56:11.201995	User
579	1	19	User	t	\N	f	2024-10-01 00:54:50.911285	User
518	1	2	User	a	\N	t	2024-09-29 23:37:53.200463	User
519	1	2	User	test	\N	t	2024-09-29 23:37:56.655042	User
522	1	2	User	a	\N	t	2024-09-29 23:40:54.917818	User
412	1	2	User	a	\N	t	2024-09-22 00:24:28.924093	User
427	1	2	User	asdfasdf	\N	t	2024-09-22 00:35:24.023966	User
407	1	2	User	asdfasdf	\N	t	2024-09-22 00:20:09.628923	User
553	1	24	User	asd	\N	f	2024-09-30 20:22:26.261284	User
458	1	1	User		\N	t	2024-09-23 00:22:29.613201	User
464	1	1	User	aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa	\N	t	2024-09-23 00:48:10.6663	User
469	1	1	User	test	\N	t	2024-09-23 01:02:32.968481	User
363	3	1	User		https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/1726931188176.jpg	t	2024-09-21 23:06:33.309165	User
452	3	1	User	test	\N	t	2024-09-22 23:58:13.423156	User
453	3	1	User	test	\N	t	2024-09-22 23:58:37.997443	User
474	3	1	User		https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/1727026613554.jpg	t	2024-09-23 01:36:56.816807	User
558	1	3	Shop	abcde	\N	f	2024-09-30 22:50:24.104502	User
498	1	3	User	test	\N	f	2024-09-29 22:56:57.041788	User
501	1	3	User		https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/1727622354776.jpg	f	2024-09-29 23:05:58.475221	User
563	1	24	User	hi	\N	f	2024-10-01 00:35:43.27627	
570	1	19	User	test	\N	f	2024-10-01 00:45:35.366226	User
575	1	16	User	a	\N	f	2024-10-01 00:52:02.428644	User
375	2	1	User	b	\N	t	2024-09-21 23:28:11.839701	User
505	2	1	User	hi	\N	t	2024-09-29 23:21:53.341975	User
495	2	1	User		https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/1727402803746.jpg	t	2024-09-27 10:06:46.307231	User
426	2	1	User	gads	\N	t	2024-09-22 00:33:31.875562	User
534	1	2	User		https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/1727632034675.jpg	t	2024-09-30 01:47:08.698088	User
391	1	2	User	a	\N	t	2024-09-21 23:59:18.530834	User
398	1	2	User	ha	\N	t	2024-09-22 00:16:02.081058	User
380	1	2	User	asdf	\N	t	2024-09-21 23:33:36.73237	User
410	1	2	User	a	\N	t	2024-09-22 00:23:14.604776	User
542	1	2	User	test	\N	t	2024-09-30 02:37:42.045814	User
397	1	2	User	asd	\N	t	2024-09-22 00:01:54.451032	User
409	1	2	User	a	\N	t	2024-09-22 00:22:50.320534	User
401	1	2	User	a	\N	t	2024-09-22 00:19:25.059593	User
416	1	2	User	a	\N	t	2024-09-22 00:27:27.625111	User
406	1	2	User	asd	\N	t	2024-09-22 00:20:03.604933	User
433	1	2	User	asd	\N	t	2024-09-22 00:38:40.010478	User
435	1	2	User	hellow	\N	t	2024-09-22 00:45:43.525202	User
402	1	2	User	a	\N	t	2024-09-22 00:19:31.625885	User
423	1	2	User	a	\N	t	2024-09-22 00:33:11.321467	User
419	1	2	User	a	\N	t	2024-09-22 00:29:26.203492	User
420	1	2	User	asd	\N	t	2024-09-22 00:29:40.850102	User
424	1	2	User	a	\N	t	2024-09-22 00:33:15.821323	User
425	1	2	User	b	\N	t	2024-09-22 00:33:20.288129	User
370	3	1	User	test	\N	t	2024-09-21 23:15:09.01956	User
459	3	1	User		\N	t	2024-09-23 00:24:06.973433	User
535	1	17	User	test	\N	f	2024-09-30 02:30:58.161358	User
554	1	1	Shop	Hello Shop Seller	\N	t	2024-09-30 20:43:39	User
465	1	1	User	aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa	\N	t	2024-09-23 00:49:33.743292	User
470	3	1	User		https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/1727024620615.jpg	t	2024-09-23 01:03:42.822378	User
364	1	3	User	test	\N	t	2024-09-21 23:13:22.414593	User
365	1	3	User	test	\N	t	2024-09-21 23:13:36.020316	User
366	1	3	User	a	\N	t	2024-09-21 23:13:39.754412	User
454	1	3	User	test	\N	t	2024-09-22 23:58:52.902603	User
475	1	3	User	test	\N	t	2024-09-23 02:05:12.804708	User
506	2	1	User	hi	\N	t	2024-09-29 23:21:53.918757	User
547	2	1	User	a	\N	t	2024-09-30 03:27:14.639344	User
376	1	2	User	abc	\N	t	2024-09-21 23:30:27.431162	User
393	1	2	User	a	\N	t	2024-09-21 23:59:48.33475	User
502	1	2	User	asd	\N	t	2024-09-29 23:16:09.864113	User
399	1	2	User	ha	\N	t	2024-09-22 00:16:08.421827	User
395	1	2	User	asd	\N	t	2024-09-22 00:00:14.095066	User
559	1	3	Shop	hello	\N	f	2024-09-30 23:51:16	User
564	1	24	User	hi	\N	f	2024-10-01 00:35:44.289966	
571	1	19	User	b	\N	f	2024-10-01 00:47:14.469712	User
576	1	15	User	a	\N	f	2024-10-01 00:53:39.601676	User
438	1	2	User	asdsad	\N	t	2024-09-22 00:46:21.06322	User
428	1	2	User	asdfasdf	\N	t	2024-09-22 00:35:29.262574	User
431	1	2	User	asd	\N	t	2024-09-22 00:36:38.419384	User
439	1	2	User	asd	\N	t	2024-09-22 00:46:30.223682	User
546	1	2	User	a	\N	t	2024-09-30 03:27:10.632798	User
436	1	2	User	hellow	\N	t	2024-09-22 00:45:49.168637	User
445	1	2	User	a	\N	t	2024-09-22 00:56:10.881912	User
497	1	2	User	Aahhh	\N	t	2024-09-27 14:51:06.330635	User
531	1	2	User	test	\N	t	2024-09-29 23:52:15.216739	User
540	1	2	User	test	\N	t	2024-09-30 02:37:05.543899	User
541	1	2	User		https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/1727635034056.jpg	t	2024-09-30 02:37:16.234822	User
455	3	1	User		\N	t	2024-09-22 23:59:48.023616	User
460	3	1	User	test	\N	t	2024-09-23 00:24:15.966164	User
471	3	1	User	asd	\N	t	2024-09-23 01:04:29.5486	User
466	1	1	User	aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa	\N	t	2024-09-23 00:49:38.867558	User
555	1	3	User	3	\N	f	2024-09-30 22:37:08.705041	User
476	3	1	User		https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/1727028596115.jpg	t	2024-09-23 02:09:58.767354	User
367	1	3	User	b	\N	t	2024-09-21 23:13:42.356967	User
369	1	3	User	c	\N	t	2024-09-21 23:15:04.872033	User
536	1	14	User	test	\N	f	2024-09-30 02:31:35.832806	User
377	2	1	User	aaa	\N	t	2024-09-21 23:30:43.076215	User
508	2	1	User	test	\N	t	2024-09-29 23:22:57.258056	User
394	1	2	User	asdfadsf	\N	t	2024-09-21 23:59:55.753003	User
413	1	2	User	a	\N	t	2024-09-22 00:24:30.12988	User
432	1	2	User	a	\N	t	2024-09-22 00:36:43.73363	User
418	1	2	User	a	\N	t	2024-09-22 00:28:50.452787	User
444	1	2	User	a	\N	t	2024-09-22 00:56:07.278235	User
510	1	2	User	test	\N	t	2024-09-29 23:23:45.979014	User
414	1	2	User	a	\N	t	2024-09-22 00:24:35.107257	User
430	1	2	User	as	\N	t	2024-09-22 00:36:26.672452	User
441	1	2	User	asd	\N	t	2024-09-22 00:54:03.968219	User
442	1	2	User	asd	\N	t	2024-09-22 00:54:14.195808	User
374	1	2	User	a	\N	t	2024-09-21 23:27:31.277136	User
392	1	2	User	abcde	\N	t	2024-09-21 23:59:30.935381	User
529	1	2	User	test	\N	t	2024-09-29 23:49:04.889088	User
437	1	2	User	asdasdasd	\N	t	2024-09-22 00:46:07.496581	User
560	1	15	User	meow	\N	f	2024-09-30 23:23:14.160729	User
565	1	24	User	hi	\N	f	2024-10-01 00:35:45.444285	
572	1	19	User	c	\N	f	2024-10-01 00:47:16.151035	User
358	1	2	User	abcde	\N	t	2024-09-21 23:02:29.411319	User
577	1	24	User	a	\N	f	2024-10-01 00:53:42.956356	User
\.


--
-- TOC entry 4958 (class 0 OID 32131)
-- Dependencies: 327
-- Data for Name: crop_category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.crop_category (crop_category_id, crop_category_name, crop_category_description, crop_category_image_url) FROM stdin;
1	Vegetables	Various types of vegetables	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png
2	Fruits	Different kinds of fruits	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png
3	Spices	Spices used for flavoring	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png
4	Seedlings	Young plants or seedlings	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png
5	Plants	General plants	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png
6	Flowers	Various types of flowers	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png
7	asdfasdf	asdfasdf	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/1724600818335.jpg
8	a	a	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/1724604559766.png
9	gggg	gggg	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/1725525361491.png
10	Michael Calalo		\N
\.


--
-- TOC entry 4960 (class 0 OID 32140)
-- Dependencies: 329
-- Data for Name: crop_sub_category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.crop_sub_category (crop_sub_category_id, crop_sub_category_name, crop_sub_category_description, crop_sub_category_image_url, crop_category_id) FROM stdin;
1	Carrots	Root vegetable, known for its orange color.	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png	1
2	Potatoes	Starchy tuber used in various dishes.	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png	1
3	Spinach	Leafy green vegetable rich in iron.	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png	1
4	Beets	Root vegetable with a sweet taste and vibrant color.	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png	1
5	Radishes	Crunchy root vegetable with a peppery flavor.	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png	1
6	Apples	Sweet, crisp fruit available in various varieties.	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png	2
7	Bananas	Tropical fruit known for its soft texture and sweetness.	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png	2
8	Oranges	Citrus fruit with a tangy flavor and high vitamin C content.	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png	2
9	Grapes	Small, round fruit that can be eaten fresh or used to make wine.	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png	2
10	Pears	Juicy fruit with a sweet, mild flavor.	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png	2
11	Black Pepper	Common spice made from peppercorns.	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png	3
12	Cumin	Spice with a warm, earthy flavor.	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png	3
13	Turmeric	Bright yellow spice used for flavor and color.	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png	3
14	Ginger	Spice with a hot, pungent flavor used in cooking and baking.	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png	3
15	Paprika	Mildly spicy red pepper used as a seasoning.	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png	3
16	Tomato Seedlings	Young plants of tomatoes.	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png	4
17	Pepper Seedlings	Young plants of bell peppers.	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png	4
18	Lettuce Seedlings	Young plants of lettuce.	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png	4
19	Cucumber Seedlings	Young plants of cucumbers.	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png	4
20	Squash Seedlings	Young plants of squash.	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png	4
21	Houseplants	Indoor plants that are easy to care for.	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png	5
22	Succulents	Plants with thick, fleshy parts adapted to dry conditions.	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png	5
23	Herbs	Plants used for culinary or medicinal purposes.	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png	5
24	Ornamental Plants	Plants grown for decorative purposes.	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png	5
25	Vines	Plants with a climbing or trailing growth habit.	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png	5
26	Sunflowers	Tall flowers known for their large yellow blooms.	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png	6
27	Roses	Popular ornamental flower with a variety of colors.	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png	6
28	Tulips	Spring-blooming flowers with a cup-shaped appearance.	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png	6
29	Lilies	Flowering plants with large, prominent flowers.	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png	6
30	Daisies	Flowers known for their simple, cheerful appearance.	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png	6
\.


--
-- TOC entry 4964 (class 0 OID 32162)
-- Dependencies: 333
-- Data for Name: crops; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.crops (crop_id, crop_name, crop_description, sub_category_id, shop_id, crop_image_url, crop_rating, crop_price, crop_quantity, crop_weight, metric_system_id) FROM stdin;
2	Baby Carrots	Small, tender baby carrots.	1	1	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png	4.80	2.80	100	0.3000	1
3	Purple Carrots	Unique variety of purple carrots.	1	1	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png	4.70	3.00	90	0.5000	1
4	Russet Potatoes	Classic starchy potatoes.	2	1	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png	4.50	3.10	150	0.7500	1
5	Red Potatoes	Smooth-skinned red potatoes.	2	2	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png	4.60	3.50	130	0.6800	1
6	Fingerling Potatoes	Small, thin-skinned fingerling potatoes.	2	2	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png	4.70	4.00	140	0.5500	1
7	Baby Spinach	Tender and young baby spinach leaves.	3	1	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png	4.80	2.50	120	0.4000	1
8	Savoy Spinach	Curly-leaved spinach variety.	3	1	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png	4.70	2.80	100	0.3500	1
9	Smooth Spinach	Flat-leaved spinach type.	3	2	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png	4.60	2.60	130	0.4200	1
10	Red Beets	Earthy and sweet root vegetable.	4	1	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png	4.50	2.30	110	0.6000	1
11	Golden Beets	Vibrant golden-colored beet variety.	4	1	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png	4.70	2.90	95	0.5500	1
12	Striped Beets	Beets with red and white stripes.	4	2	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png	4.80	3.10	85	0.5000	1
13	Red Radishes	Crisp and spicy red radishes.	5	1	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png	4.40	2.20	140	0.2500	1
14	Daikon Radish	Large white radish with mild flavor.	5	1	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png	4.60	2.60	110	0.4000	1
15	Watermelon Radish	Radish with a sweet taste and vibrant interior.	5	2	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png	4.70	2.90	100	0.3000	1
16	Red Apples	Crisp and sweet red apples.	6	1	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png	4.60	3.00	150	0.2000	1
17	Green Apples	Tart and crunchy green apples.	6	1	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png	4.70	3.20	140	0.2500	1
18	Honeycrisp Apples	Juicy apples with a perfect balance of sweetness and tartness.	6	2	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png	4.90	3.50	120	0.2200	1
19	Cavendish Bananas	Popular and sweet banana variety.	7	1	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png	4.80	2.50	180	0.1500	1
20	Red Bananas	Sweet bananas with a reddish-purple skin.	7	1	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png	4.70	2.80	160	0.2000	1
21	Plantains	Starchy bananas typically used for cooking.	7	2	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png	4.60	3.00	140	0.3000	1
22	Black Peppercorns	Whole black peppercorns for grinding.	11	1	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png	4.90	5.00	50	0.0100	1
23	Ground Black Pepper	Pre-ground black pepper for cooking.	11	1	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png	4.70	4.80	60	0.0120	1
24	11	11	\N	2	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/1727295173923.jpg	5.00	11.00	11	11.0000	1
1	Orange Carrots	Fresh and sweet orange carrots.	1	2	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png	4.00	2.00	420	0.0000	1
25	w	w	\N	1	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/1727364015510.jpg	5.00	123.00	1	1.0000	1
\.


--
-- TOC entry 4962 (class 0 OID 32155)
-- Dependencies: 331
-- Data for Name: metric_system; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.metric_system (metric_system_id, metric_system_name, metric_val_kilogram, metric_val_gram, metric_val_pounds, metric_system_symbol) FROM stdin;
1	Kilogram	1.0000	1000.0000	2.2046	kg
2	Pound	0.4536	453.5927	1.0000	lb
\.


--
-- TOC entry 4980 (class 0 OID 32372)
-- Dependencies: 349
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (notification_id, user_id, message, is_read, notification_date, title) FROM stdin;
2	2	Your payment has been processed.	t	2024-08-15 12:00:00	Title try
16	2	haha	f	2024-09-22 01:05:16.222353	hahaha
18	2	sellllll	f	2024-09-22 01:32:15.732538	seller
19	2	a	f	2024-09-22 01:32:39.015385	a
20	2	m	f	2024-09-22 01:35:26.142587	t
21	2	mm	f	2024-09-22 01:47:21.753023	tt
25	2	llll	f	2024-09-22 01:51:00.028452	see
26	2	aaaaaaa	f	2024-09-22 01:56:46.39517	aaaa
33	2	seller	f	2024-09-22 02:11:32.753035	seller
34	2	g	f	2024-09-22 02:11:44.485416	g
35	3	123	f	2024-09-22 02:12:45.132966	123
41	1	1	t	2024-09-22 02:55:36.62929	1
42	1	try	t	2024-09-22 02:57:57.555412	trtry
27	1	aaaaaaaaaaaa	t	2024-09-22 01:56:57.37263	\N
30	1	a	t	2024-09-22 02:02:58.442248	a
22	1	asdasd	t	2024-09-22 01:47:46.059658	asd
23	1	asdad	t	2024-09-22 01:49:05.095355	asd
24	1	bbb	t	2024-09-22 01:50:38.404842	aaa
28	1	aaa	t	2024-09-22 01:58:31.420067	aa
29	1	www	t	2024-09-22 02:02:17.658925	qqq
31	1	asdasdasd	t	2024-09-22 02:03:39.232368	asdasdasd
32	1	a	t	2024-09-22 02:11:07.441884	a
14	1	tt	t	2024-09-19 03:33:49.665862	\N
15	1	msg	t	2024-09-22 01:02:59.65745	\N
17	1	a	t	2024-09-22 01:05:41.044276	\N
36	1	aaa	t	2024-09-22 02:27:38.828857	aaa
37	1	asd	t	2024-09-22 02:38:05.536482	as
38	1	a	t	2024-09-22 02:48:57.629932	a
39	1	a	t	2024-09-22 02:51:26.616407	a
40	1	a	t	2024-09-22 02:52:44.997846	a
13	1	notif test	t	2024-09-19 03:33:39.474714	\N
\.


--
-- TOC entry 4970 (class 0 OID 32224)
-- Dependencies: 339
-- Data for Name: order_products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_products (order_prod_id, order_id, order_prod_crop_id, order_prod_total_weight, order_prod_total_price, order_prod_user_id, order_prod_metric_system_id) FROM stdin;
1	1	1	1	2.99	3	1
2	2	2	1	1.49	2	1
\.


--
-- TOC entry 4966 (class 0 OID 32189)
-- Dependencies: 335
-- Data for Name: order_status; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_status (order_status_id, order_status_name, order_status_description) FROM stdin;
1	To Confirm	Order has been placed and is awaiting processing.
5	For Return	Order has been cancelled.
6	Returned	\N
2	Preparing	Order is being processed.
3	Shipping	Order has been shipped.
4	Pickup	Order has been delivered.
7	Completed	\N
\.


--
-- TOC entry 4976 (class 0 OID 32342)
-- Dependencies: 345
-- Data for Name: order_tracking; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_tracking (tracking_id, order_id, status, update_date) FROM stdin;
1	1	Placed	2024-08-15 10:05:00
2	2	Shipped	2024-08-15 12:15:00
\.


--
-- TOC entry 4968 (class 0 OID 32198)
-- Dependencies: 337
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (order_id, total_price, total_weight, status_id, user_id, order_date, order_metric_system_id) FROM stdin;
3	500.00	5.0000	4	1	2024-09-22 00:59:14	1
5	100.00	50.0000	4	1	2024-09-24 01:02:29	1
6	300.00	20.0000	4	2	2024-02-14 01:19:39	1
7	40.00	40.0000	4	2	2024-04-09 01:21:12	1
4	250.00	4.0000	4	3	2024-05-21 01:00:04	1
2	1.50	0.2000	4	2	2024-05-08 12:00:00	1
1	29.97	0.4500	1	3	2024-08-15 10:00:00	1
\.


--
-- TOC entry 4978 (class 0 OID 32357)
-- Dependencies: 347
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments (payment_id, order_id, payment_method, payment_status, payment_date, amount) FROM stdin;
1	1	Credit Card	Completed	2024-08-15 10:10:00	29.97
2	2	PayPal	Pending	2024-08-15 12:20:00	1.49
\.


--
-- TOC entry 4974 (class 0 OID 32328)
-- Dependencies: 343
-- Data for Name: review_images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.review_images (review_image_id, review_id, image_url, uploaded_at) FROM stdin;
1	1	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png	2024-08-23 15:19:18.454743
2	1	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png	2024-08-23 15:19:18.454743
3	2	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png	2024-08-23 15:19:18.454743
\.


--
-- TOC entry 4972 (class 0 OID 32305)
-- Dependencies: 341
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reviews (review_id, crop_id, user_id, rating, review_text, review_date) FROM stdin;
1	1	3	5.0	Excellent tomatoes, fresh and juicy!	2024-08-15 09:00:00
2	2	2	4.0	Nice apples, but a bit pricey.	2024-08-15 11:00:00
\.


--
-- TOC entry 4956 (class 0 OID 32116)
-- Dependencies: 325
-- Data for Name: shop; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.shop (shop_id, shop_name, shop_address, shop_description, user_id, shop_image_url, shop_location) FROM stdin;
2	Sellers Market	456 Seller Avenue, Seller Town, Seller Country	A market managed by the seller.	2	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png	\N
3	shopshop	somewheren	aaa	14	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/1727300231789.jpg	0101000020E610000082CC55D6F9255E404B3DAA7777693040
12	rara	somewheren	Shop Desc	16	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/1727300231789.jpg	0101000020E610000082CC55D6F9255E404B3DAA7777693040
6	asdasdasd	somewheren	Shop Desc	14	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/1727300231789.jpg	0101000020E610000082CC55D6F9255E404B3DAA7777693040
1	Admin Shop	123 Admin Street, Admin City, Admin Country	The admins shop for everything.	1	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/loooogooooo%20(1).png	\N
5	Michael Store	somewheren	Shop Desc	13	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/1727300231789.jpg	0101000020E610000082CC55D6F9255E404B3DAA7777693040
\.


--
-- TOC entry 4664 (class 0 OID 33275)
-- Dependencies: 353
-- Data for Name: spatial_ref_sys; Type: TABLE DATA; Schema: public; Owner: supabase_admin
--

COPY public.spatial_ref_sys (srid, auth_name, auth_srid, srtext, proj4text) FROM stdin;
\.


--
-- TOC entry 4950 (class 0 OID 32073)
-- Dependencies: 319
-- Data for Name: user_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_type (user_type_id, user_type_name, user_type_description) FROM stdin;
1	Admin	Administrator with full access rights
2	Seller	Seller with permissions to manage products and orders
3	Buyer	Buyer can buy
\.


--
-- TOC entry 4952 (class 0 OID 32082)
-- Dependencies: 321
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, firstname, middlename, lastname, email, password, phone_number, gender, birthday, user_type_id, verified, user_image_url, created_at, updated_at) FROM stdin;
17	Niko		Pars	admin0@gmail.com	$2a$10$rYzQOkixAx1MtkVKtaFx6OyOdtGcAKP.pW73zdeyvpMKqw5ST1Im.	09123456787	Male	2000-01-01	3	f	\N	2024-09-25 18:55:19.927335+08	2024-09-25 18:55:19.927335+08
24	qqq	qqq	qqq	q@q.com	$2a$10$aortKEYDNt99sxe94bfPI.ODqbxN7FTxtz8Ri.0ntEKMbkQqVXA/W	09123456784	Male	2024-09-29	3	\N	\N	2024-09-29 15:54:01.848786+08	2024-09-29 15:54:01.848786+08
16	Rafael Martin	Emperador	Aquino	rafael@example.com	$2a$10$ihFj6etpy1.MFfD5TqxVaOovFFTKzLv5ZDY1FF/Xt4ZIDH3JGfd2C	09123456788	Male	2002-02-23	1	f	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/1727300231789.jpg	2024-09-23 14:52:01.656753+08	2024-09-23 14:52:01.656753+08
1	Michael	A	AgriTayo	admin@gmail.com	$2a$10$ihFj6etpy1.MFfD5TqxVaOovFFTKzLv5ZDY1FF/Xt4ZIDH3JGfd2C	09123456789	Male	2000-02-05	1	f	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/1727719068406.jpg	2024-09-17 15:01:15+08	2024-09-19 15:03:26.725801+08
3	Buyer	B.	Buyerson	buyer@gmail.com	$2a$10$ihFj6etpy1.MFfD5TqxVaOovFFTKzLv5ZDY1FF/Xt4ZIDH3JGfd2C	09123456788	Other	1990-10-30	3	f	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/1726418539415.jpg	2024-09-19 15:01:15.248267+08	2024-09-19 15:03:26.725801+08
18	test	test	test	test@gmail.com	$2a$10$g6zj5bfy4OEH7DEigLUHneJfdidRKenL9Pf5qDuYrFhkYef0ogY1K	099352832	Male	2024-09-03	3	f	\N	2024-09-27 01:47:29.755727+08	2024-09-27 01:47:29.755727+08
13	Oliver Kean		Palgue	oliverkean24@gmail.com	$2a$10$BejUci/ZkH/Drh6mMtJvbOA3EeCEyGForGNetxfcAP3tdDx3EMjzu	9276279962	Male	2024-09-18	3	f	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/1726418539415.jpg	2024-09-19 15:01:15.248267+08	2024-09-19 15:03:26.725801+08
14	Posa	Na	Black	posa@gmail.com	$2a$10$x0p1whMC9GQaWt8ySPqXbeJWz4/kHsnJEH9U8ZjKkKFCc34x.9bDu	09090909090	Male	2024-09-19	2	f	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/1726418539415.jpg	2024-09-17 15:09:54+08	2024-09-19 15:09:54.582745+08
15	posa	na	white	meow@gmail.com	$2a$10$H5tJr6g92m5ckXEbTy9PyenaaWvvNm.saEuu50lYCexy45Y.NJTky	12345678900	Male	2024-09-19	3	f	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/1726418539415.jpg	2024-09-19 15:13:16.014768+08	2024-09-19 15:13:16.014768+08
2	Seller	S.	Sellerson	seller@gmail.com	$2b$10$TuNHzdg3GAgbf4x4qDGyheiuiH5xZ7lHeJDgs61gGu0WOtOUF3nH.	234-567-8901	Female	1985-05-15	1	f	https://ujkduozvtzkaiqqtztuy.supabase.co/storage/v1/object/public/agritayoimages/1726060066637.png	2024-09-18 15:01:15+08	2024-09-19 15:03:26.725801+08
19	t	t	t	a@a.com	$2a$10$jzLKaFXtSrvigUVrxIL7uurw9t.hL5dULoVh3WGssMKadfK5uefIC	09233265489	Male	2024-09-29	3	f	\N	2024-09-29 14:59:20.127681+08	2024-09-29 14:59:20.127681+08
\.


--
-- TOC entry 5049 (class 0 OID 0)
-- Dependencies: 322
-- Name: addresses_address_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.addresses_address_id_seq', 6, true);


--
-- TOC entry 5050 (class 0 OID 0)
-- Dependencies: 359
-- Name: cart_cart_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cart_cart_id_seq', 5, true);


--
-- TOC entry 5051 (class 0 OID 0)
-- Dependencies: 350
-- Name: chats_chat_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.chats_chat_id_seq', 583, true);


--
-- TOC entry 5052 (class 0 OID 0)
-- Dependencies: 326
-- Name: crop_category_crop_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.crop_category_crop_category_id_seq', 10, true);


--
-- TOC entry 5053 (class 0 OID 0)
-- Dependencies: 328
-- Name: crop_sub_category_crop_sub_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.crop_sub_category_crop_sub_category_id_seq', 30, true);


--
-- TOC entry 5054 (class 0 OID 0)
-- Dependencies: 332
-- Name: crops_crop_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.crops_crop_id_seq', 25, true);


--
-- TOC entry 5055 (class 0 OID 0)
-- Dependencies: 330
-- Name: metric_system_metric_system_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.metric_system_metric_system_id_seq', 2, true);


--
-- TOC entry 5056 (class 0 OID 0)
-- Dependencies: 348
-- Name: notifications_notification_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notifications_notification_id_seq', 42, true);


--
-- TOC entry 5057 (class 0 OID 0)
-- Dependencies: 338
-- Name: order_products_order_prod_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_products_order_prod_id_seq', 2, true);


--
-- TOC entry 5058 (class 0 OID 0)
-- Dependencies: 334
-- Name: order_status_order_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_status_order_status_id_seq', 7, true);


--
-- TOC entry 5059 (class 0 OID 0)
-- Dependencies: 344
-- Name: order_tracking_tracking_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_tracking_tracking_id_seq', 2, true);


--
-- TOC entry 5060 (class 0 OID 0)
-- Dependencies: 336
-- Name: orders_order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_order_id_seq', 7, true);


--
-- TOC entry 5061 (class 0 OID 0)
-- Dependencies: 346
-- Name: payments_payment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payments_payment_id_seq', 2, true);


--
-- TOC entry 5062 (class 0 OID 0)
-- Dependencies: 342
-- Name: review_images_review_image_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.review_images_review_image_id_seq', 3, true);


--
-- TOC entry 5063 (class 0 OID 0)
-- Dependencies: 340
-- Name: reviews_review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reviews_review_id_seq', 2, true);


--
-- TOC entry 5064 (class 0 OID 0)
-- Dependencies: 324
-- Name: shop_shop_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.shop_shop_id_seq', 12, true);


--
-- TOC entry 5065 (class 0 OID 0)
-- Dependencies: 318
-- Name: user_type_user_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_type_user_type_id_seq', 3, true);


--
-- TOC entry 5066 (class 0 OID 0)
-- Dependencies: 320
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_user_id_seq', 24, true);


--
-- TOC entry 4711 (class 2606 OID 32108)
-- Name: addresses addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT addresses_pkey PRIMARY KEY (address_id);


--
-- TOC entry 4764 (class 2606 OID 41433)
-- Name: cart cart_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_pkey PRIMARY KEY (cart_id);


--
-- TOC entry 4758 (class 2606 OID 32607)
-- Name: chats chats_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chats
    ADD CONSTRAINT chats_pkey PRIMARY KEY (chat_id);


--
-- TOC entry 4717 (class 2606 OID 32138)
-- Name: crop_category crop_category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.crop_category
    ADD CONSTRAINT crop_category_pkey PRIMARY KEY (crop_category_id);


--
-- TOC entry 4719 (class 2606 OID 32147)
-- Name: crop_sub_category crop_sub_category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.crop_sub_category
    ADD CONSTRAINT crop_sub_category_pkey PRIMARY KEY (crop_sub_category_id);


--
-- TOC entry 4724 (class 2606 OID 32169)
-- Name: crops crops_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.crops
    ADD CONSTRAINT crops_pkey PRIMARY KEY (crop_id);


--
-- TOC entry 4722 (class 2606 OID 32160)
-- Name: metric_system metric_system_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.metric_system
    ADD CONSTRAINT metric_system_pkey PRIMARY KEY (metric_system_id);


--
-- TOC entry 4756 (class 2606 OID 32381)
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (notification_id);


--
-- TOC entry 4740 (class 2606 OID 32229)
-- Name: order_products order_products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_products
    ADD CONSTRAINT order_products_pkey PRIMARY KEY (order_prod_id);


--
-- TOC entry 4729 (class 2606 OID 32196)
-- Name: order_status order_status_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_status
    ADD CONSTRAINT order_status_pkey PRIMARY KEY (order_status_id);


--
-- TOC entry 4750 (class 2606 OID 32349)
-- Name: order_tracking order_tracking_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_tracking
    ADD CONSTRAINT order_tracking_pkey PRIMARY KEY (tracking_id);


--
-- TOC entry 4734 (class 2606 OID 32204)
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (order_id);


--
-- TOC entry 4753 (class 2606 OID 32364)
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (payment_id);


--
-- TOC entry 4747 (class 2606 OID 32334)
-- Name: review_images review_images_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review_images
    ADD CONSTRAINT review_images_pkey PRIMARY KEY (review_image_id);


--
-- TOC entry 4744 (class 2606 OID 32314)
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (review_id);


--
-- TOC entry 4715 (class 2606 OID 32123)
-- Name: shop shop_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shop
    ADD CONSTRAINT shop_pkey PRIMARY KEY (shop_id);


--
-- TOC entry 4704 (class 2606 OID 32080)
-- Name: user_type user_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_type
    ADD CONSTRAINT user_type_pkey PRIMARY KEY (user_type_id);


--
-- TOC entry 4707 (class 2606 OID 32093)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4709 (class 2606 OID 32091)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- TOC entry 4712 (class 1259 OID 32114)
-- Name: idx_addresses_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_addresses_user_id ON public.addresses USING btree (user_id);


--
-- TOC entry 4765 (class 1259 OID 41451)
-- Name: idx_cart_crop_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cart_crop_id ON public.cart USING btree (cart_crop_id);


--
-- TOC entry 4766 (class 1259 OID 41450)
-- Name: idx_cart_metric_system_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cart_metric_system_id ON public.cart USING btree (cart_metric_system_id);


--
-- TOC entry 4767 (class 1259 OID 41449)
-- Name: idx_cart_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cart_user_id ON public.cart USING btree (cart_user_id);


--
-- TOC entry 4759 (class 1259 OID 32614)
-- Name: idx_chats_receiver_id_receiver_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_chats_receiver_id_receiver_type ON public.chats USING btree (receiver_id, receiver_type);


--
-- TOC entry 4760 (class 1259 OID 32613)
-- Name: idx_chats_sender_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_chats_sender_id ON public.chats USING btree (sender_id);


--
-- TOC entry 4720 (class 1259 OID 32153)
-- Name: idx_crop_sub_category_crop_category_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_crop_sub_category_crop_category_id ON public.crop_sub_category USING btree (crop_category_id);


--
-- TOC entry 4725 (class 1259 OID 32187)
-- Name: idx_crops_metric_system_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_crops_metric_system_id ON public.crops USING btree (metric_system_id);


--
-- TOC entry 4726 (class 1259 OID 32186)
-- Name: idx_crops_shop_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_crops_shop_id ON public.crops USING btree (shop_id);


--
-- TOC entry 4727 (class 1259 OID 32185)
-- Name: idx_crops_sub_category_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_crops_sub_category_id ON public.crops USING btree (sub_category_id);


--
-- TOC entry 4754 (class 1259 OID 32387)
-- Name: idx_notifications_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notifications_user_id ON public.notifications USING btree (user_id);


--
-- TOC entry 4735 (class 1259 OID 32251)
-- Name: idx_order_products_crop_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_order_products_crop_id ON public.order_products USING btree (order_prod_crop_id);


--
-- TOC entry 4736 (class 1259 OID 32253)
-- Name: idx_order_products_metric_system_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_order_products_metric_system_id ON public.order_products USING btree (order_prod_metric_system_id);


--
-- TOC entry 4737 (class 1259 OID 32250)
-- Name: idx_order_products_order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_order_products_order_id ON public.order_products USING btree (order_id);


--
-- TOC entry 4738 (class 1259 OID 32252)
-- Name: idx_order_products_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_order_products_user_id ON public.order_products USING btree (order_prod_user_id);


--
-- TOC entry 4748 (class 1259 OID 32355)
-- Name: idx_order_tracking_order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_order_tracking_order_id ON public.order_tracking USING btree (order_id);


--
-- TOC entry 4730 (class 1259 OID 32222)
-- Name: idx_orders_metric_system_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_orders_metric_system_id ON public.orders USING btree (order_metric_system_id);


--
-- TOC entry 4731 (class 1259 OID 32220)
-- Name: idx_orders_status_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_orders_status_id ON public.orders USING btree (status_id);


--
-- TOC entry 4732 (class 1259 OID 32221)
-- Name: idx_orders_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_orders_user_id ON public.orders USING btree (user_id);


--
-- TOC entry 4751 (class 1259 OID 32370)
-- Name: idx_payments_order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payments_order_id ON public.payments USING btree (order_id);


--
-- TOC entry 4745 (class 1259 OID 32340)
-- Name: idx_review_images_review_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_review_images_review_id ON public.review_images USING btree (review_id);


--
-- TOC entry 4741 (class 1259 OID 32325)
-- Name: idx_reviews_crop_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reviews_crop_id ON public.reviews USING btree (crop_id);


--
-- TOC entry 4742 (class 1259 OID 32326)
-- Name: idx_reviews_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reviews_user_id ON public.reviews USING btree (user_id);


--
-- TOC entry 4713 (class 1259 OID 32129)
-- Name: idx_shop_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_shop_user_id ON public.shop USING btree (user_id);


--
-- TOC entry 4705 (class 1259 OID 32099)
-- Name: idx_users_user_type_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_user_type_id ON public.users USING btree (user_type_id);


--
-- TOC entry 4769 (class 2606 OID 32109)
-- Name: addresses addresses_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT addresses_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 4789 (class 2606 OID 41439)
-- Name: cart cart_cart_crop_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_cart_crop_id_fkey FOREIGN KEY (cart_crop_id) REFERENCES public.crops(crop_id) ON DELETE SET NULL;


--
-- TOC entry 4790 (class 2606 OID 41444)
-- Name: cart cart_cart_metric_system_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_cart_metric_system_id_fkey FOREIGN KEY (cart_metric_system_id) REFERENCES public.metric_system(metric_system_id) ON DELETE SET NULL;


--
-- TOC entry 4791 (class 2606 OID 41434)
-- Name: cart cart_cart_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_cart_user_id_fkey FOREIGN KEY (cart_user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 4788 (class 2606 OID 32608)
-- Name: chats chats_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chats
    ADD CONSTRAINT chats_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 4771 (class 2606 OID 32148)
-- Name: crop_sub_category crop_sub_category_crop_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.crop_sub_category
    ADD CONSTRAINT crop_sub_category_crop_category_id_fkey FOREIGN KEY (crop_category_id) REFERENCES public.crop_category(crop_category_id) ON DELETE SET NULL;


--
-- TOC entry 4772 (class 2606 OID 32180)
-- Name: crops crops_metric_system_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.crops
    ADD CONSTRAINT crops_metric_system_id_fkey FOREIGN KEY (metric_system_id) REFERENCES public.metric_system(metric_system_id) ON DELETE SET NULL;


--
-- TOC entry 4773 (class 2606 OID 32175)
-- Name: crops crops_shop_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.crops
    ADD CONSTRAINT crops_shop_id_fkey FOREIGN KEY (shop_id) REFERENCES public.shop(shop_id) ON DELETE SET NULL;


--
-- TOC entry 4774 (class 2606 OID 32170)
-- Name: crops crops_sub_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.crops
    ADD CONSTRAINT crops_sub_category_id_fkey FOREIGN KEY (sub_category_id) REFERENCES public.crop_sub_category(crop_sub_category_id) ON DELETE SET NULL;


--
-- TOC entry 4787 (class 2606 OID 32382)
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 4778 (class 2606 OID 32230)
-- Name: order_products order_products_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_products
    ADD CONSTRAINT order_products_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(order_id) ON DELETE CASCADE;


--
-- TOC entry 4779 (class 2606 OID 32235)
-- Name: order_products order_products_order_prod_crop_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_products
    ADD CONSTRAINT order_products_order_prod_crop_id_fkey FOREIGN KEY (order_prod_crop_id) REFERENCES public.crops(crop_id) ON DELETE SET NULL;


--
-- TOC entry 4780 (class 2606 OID 32245)
-- Name: order_products order_products_order_prod_metric_system_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_products
    ADD CONSTRAINT order_products_order_prod_metric_system_id_fkey FOREIGN KEY (order_prod_metric_system_id) REFERENCES public.metric_system(metric_system_id) ON DELETE SET NULL;


--
-- TOC entry 4781 (class 2606 OID 32240)
-- Name: order_products order_products_order_prod_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_products
    ADD CONSTRAINT order_products_order_prod_user_id_fkey FOREIGN KEY (order_prod_user_id) REFERENCES public.users(user_id) ON DELETE SET NULL;


--
-- TOC entry 4785 (class 2606 OID 32350)
-- Name: order_tracking order_tracking_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_tracking
    ADD CONSTRAINT order_tracking_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(order_id) ON DELETE CASCADE;


--
-- TOC entry 4775 (class 2606 OID 32215)
-- Name: orders orders_order_metric_system_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_order_metric_system_id_fkey FOREIGN KEY (order_metric_system_id) REFERENCES public.metric_system(metric_system_id) ON DELETE SET NULL;


--
-- TOC entry 4776 (class 2606 OID 32205)
-- Name: orders orders_status_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_status_id_fkey FOREIGN KEY (status_id) REFERENCES public.order_status(order_status_id) ON DELETE SET NULL;


--
-- TOC entry 4777 (class 2606 OID 32210)
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE SET NULL;


--
-- TOC entry 4786 (class 2606 OID 32365)
-- Name: payments payments_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(order_id) ON DELETE CASCADE;


--
-- TOC entry 4784 (class 2606 OID 32335)
-- Name: review_images review_images_review_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review_images
    ADD CONSTRAINT review_images_review_id_fkey FOREIGN KEY (review_id) REFERENCES public.reviews(review_id) ON DELETE CASCADE;


--
-- TOC entry 4782 (class 2606 OID 32315)
-- Name: reviews reviews_crop_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_crop_id_fkey FOREIGN KEY (crop_id) REFERENCES public.crops(crop_id) ON DELETE CASCADE;


--
-- TOC entry 4783 (class 2606 OID 32320)
-- Name: reviews reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 4770 (class 2606 OID 32124)
-- Name: shop shop_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shop
    ADD CONSTRAINT shop_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE SET NULL;


--
-- TOC entry 4768 (class 2606 OID 32094)
-- Name: users users_user_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_user_type_id_fkey FOREIGN KEY (user_type_id) REFERENCES public.user_type(user_type_id);


--
-- TOC entry 4991 (class 0 OID 0)
-- Dependencies: 30
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;


--
-- TOC entry 4992 (class 0 OID 0)
-- Dependencies: 1329
-- Name: FUNCTION get_shops_with_coordinates(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_shops_with_coordinates() TO anon;
GRANT ALL ON FUNCTION public.get_shops_with_coordinates() TO authenticated;
GRANT ALL ON FUNCTION public.get_shops_with_coordinates() TO service_role;


--
-- TOC entry 4993 (class 0 OID 0)
-- Dependencies: 323
-- Name: TABLE addresses; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.addresses TO anon;
GRANT ALL ON TABLE public.addresses TO authenticated;
GRANT ALL ON TABLE public.addresses TO service_role;


--
-- TOC entry 4995 (class 0 OID 0)
-- Dependencies: 322
-- Name: SEQUENCE addresses_address_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.addresses_address_id_seq TO anon;
GRANT ALL ON SEQUENCE public.addresses_address_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.addresses_address_id_seq TO service_role;


--
-- TOC entry 4996 (class 0 OID 0)
-- Dependencies: 360
-- Name: TABLE cart; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.cart TO anon;
GRANT ALL ON TABLE public.cart TO authenticated;
GRANT ALL ON TABLE public.cart TO service_role;


--
-- TOC entry 4998 (class 0 OID 0)
-- Dependencies: 359
-- Name: SEQUENCE cart_cart_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.cart_cart_id_seq TO anon;
GRANT ALL ON SEQUENCE public.cart_cart_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.cart_cart_id_seq TO service_role;


--
-- TOC entry 4999 (class 0 OID 0)
-- Dependencies: 351
-- Name: TABLE chats; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.chats TO anon;
GRANT ALL ON TABLE public.chats TO authenticated;
GRANT ALL ON TABLE public.chats TO service_role;


--
-- TOC entry 5001 (class 0 OID 0)
-- Dependencies: 350
-- Name: SEQUENCE chats_chat_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.chats_chat_id_seq TO anon;
GRANT ALL ON SEQUENCE public.chats_chat_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.chats_chat_id_seq TO service_role;


--
-- TOC entry 5002 (class 0 OID 0)
-- Dependencies: 327
-- Name: TABLE crop_category; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.crop_category TO anon;
GRANT ALL ON TABLE public.crop_category TO authenticated;
GRANT ALL ON TABLE public.crop_category TO service_role;


--
-- TOC entry 5004 (class 0 OID 0)
-- Dependencies: 326
-- Name: SEQUENCE crop_category_crop_category_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.crop_category_crop_category_id_seq TO anon;
GRANT ALL ON SEQUENCE public.crop_category_crop_category_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.crop_category_crop_category_id_seq TO service_role;


--
-- TOC entry 5005 (class 0 OID 0)
-- Dependencies: 329
-- Name: TABLE crop_sub_category; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.crop_sub_category TO anon;
GRANT ALL ON TABLE public.crop_sub_category TO authenticated;
GRANT ALL ON TABLE public.crop_sub_category TO service_role;


--
-- TOC entry 5007 (class 0 OID 0)
-- Dependencies: 328
-- Name: SEQUENCE crop_sub_category_crop_sub_category_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.crop_sub_category_crop_sub_category_id_seq TO anon;
GRANT ALL ON SEQUENCE public.crop_sub_category_crop_sub_category_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.crop_sub_category_crop_sub_category_id_seq TO service_role;


--
-- TOC entry 5008 (class 0 OID 0)
-- Dependencies: 333
-- Name: TABLE crops; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.crops TO anon;
GRANT ALL ON TABLE public.crops TO authenticated;
GRANT ALL ON TABLE public.crops TO service_role;


--
-- TOC entry 5010 (class 0 OID 0)
-- Dependencies: 332
-- Name: SEQUENCE crops_crop_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.crops_crop_id_seq TO anon;
GRANT ALL ON SEQUENCE public.crops_crop_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.crops_crop_id_seq TO service_role;


--
-- TOC entry 5011 (class 0 OID 0)
-- Dependencies: 331
-- Name: TABLE metric_system; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.metric_system TO anon;
GRANT ALL ON TABLE public.metric_system TO authenticated;
GRANT ALL ON TABLE public.metric_system TO service_role;


--
-- TOC entry 5013 (class 0 OID 0)
-- Dependencies: 330
-- Name: SEQUENCE metric_system_metric_system_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.metric_system_metric_system_id_seq TO anon;
GRANT ALL ON SEQUENCE public.metric_system_metric_system_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.metric_system_metric_system_id_seq TO service_role;


--
-- TOC entry 5014 (class 0 OID 0)
-- Dependencies: 349
-- Name: TABLE notifications; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.notifications TO anon;
GRANT ALL ON TABLE public.notifications TO authenticated;
GRANT ALL ON TABLE public.notifications TO service_role;


--
-- TOC entry 5016 (class 0 OID 0)
-- Dependencies: 348
-- Name: SEQUENCE notifications_notification_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.notifications_notification_id_seq TO anon;
GRANT ALL ON SEQUENCE public.notifications_notification_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.notifications_notification_id_seq TO service_role;


--
-- TOC entry 5017 (class 0 OID 0)
-- Dependencies: 339
-- Name: TABLE order_products; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.order_products TO anon;
GRANT ALL ON TABLE public.order_products TO authenticated;
GRANT ALL ON TABLE public.order_products TO service_role;


--
-- TOC entry 5019 (class 0 OID 0)
-- Dependencies: 338
-- Name: SEQUENCE order_products_order_prod_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.order_products_order_prod_id_seq TO anon;
GRANT ALL ON SEQUENCE public.order_products_order_prod_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.order_products_order_prod_id_seq TO service_role;


--
-- TOC entry 5020 (class 0 OID 0)
-- Dependencies: 335
-- Name: TABLE order_status; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.order_status TO anon;
GRANT ALL ON TABLE public.order_status TO authenticated;
GRANT ALL ON TABLE public.order_status TO service_role;


--
-- TOC entry 5022 (class 0 OID 0)
-- Dependencies: 334
-- Name: SEQUENCE order_status_order_status_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.order_status_order_status_id_seq TO anon;
GRANT ALL ON SEQUENCE public.order_status_order_status_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.order_status_order_status_id_seq TO service_role;


--
-- TOC entry 5023 (class 0 OID 0)
-- Dependencies: 345
-- Name: TABLE order_tracking; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.order_tracking TO anon;
GRANT ALL ON TABLE public.order_tracking TO authenticated;
GRANT ALL ON TABLE public.order_tracking TO service_role;


--
-- TOC entry 5025 (class 0 OID 0)
-- Dependencies: 344
-- Name: SEQUENCE order_tracking_tracking_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.order_tracking_tracking_id_seq TO anon;
GRANT ALL ON SEQUENCE public.order_tracking_tracking_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.order_tracking_tracking_id_seq TO service_role;


--
-- TOC entry 5026 (class 0 OID 0)
-- Dependencies: 337
-- Name: TABLE orders; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.orders TO anon;
GRANT ALL ON TABLE public.orders TO authenticated;
GRANT ALL ON TABLE public.orders TO service_role;


--
-- TOC entry 5028 (class 0 OID 0)
-- Dependencies: 336
-- Name: SEQUENCE orders_order_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.orders_order_id_seq TO anon;
GRANT ALL ON SEQUENCE public.orders_order_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.orders_order_id_seq TO service_role;


--
-- TOC entry 5029 (class 0 OID 0)
-- Dependencies: 347
-- Name: TABLE payments; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.payments TO anon;
GRANT ALL ON TABLE public.payments TO authenticated;
GRANT ALL ON TABLE public.payments TO service_role;


--
-- TOC entry 5031 (class 0 OID 0)
-- Dependencies: 346
-- Name: SEQUENCE payments_payment_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.payments_payment_id_seq TO anon;
GRANT ALL ON SEQUENCE public.payments_payment_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.payments_payment_id_seq TO service_role;


--
-- TOC entry 5032 (class 0 OID 0)
-- Dependencies: 343
-- Name: TABLE review_images; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.review_images TO anon;
GRANT ALL ON TABLE public.review_images TO authenticated;
GRANT ALL ON TABLE public.review_images TO service_role;


--
-- TOC entry 5034 (class 0 OID 0)
-- Dependencies: 342
-- Name: SEQUENCE review_images_review_image_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.review_images_review_image_id_seq TO anon;
GRANT ALL ON SEQUENCE public.review_images_review_image_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.review_images_review_image_id_seq TO service_role;


--
-- TOC entry 5035 (class 0 OID 0)
-- Dependencies: 341
-- Name: TABLE reviews; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.reviews TO anon;
GRANT ALL ON TABLE public.reviews TO authenticated;
GRANT ALL ON TABLE public.reviews TO service_role;


--
-- TOC entry 5037 (class 0 OID 0)
-- Dependencies: 340
-- Name: SEQUENCE reviews_review_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.reviews_review_id_seq TO anon;
GRANT ALL ON SEQUENCE public.reviews_review_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.reviews_review_id_seq TO service_role;


--
-- TOC entry 5038 (class 0 OID 0)
-- Dependencies: 325
-- Name: TABLE shop; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.shop TO anon;
GRANT ALL ON TABLE public.shop TO authenticated;
GRANT ALL ON TABLE public.shop TO service_role;


--
-- TOC entry 5040 (class 0 OID 0)
-- Dependencies: 324
-- Name: SEQUENCE shop_shop_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.shop_shop_id_seq TO anon;
GRANT ALL ON SEQUENCE public.shop_shop_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.shop_shop_id_seq TO service_role;


--
-- TOC entry 5041 (class 0 OID 0)
-- Dependencies: 358
-- Name: TABLE shop_with_coordinates; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.shop_with_coordinates TO anon;
GRANT ALL ON TABLE public.shop_with_coordinates TO authenticated;
GRANT ALL ON TABLE public.shop_with_coordinates TO service_role;


--
-- TOC entry 5042 (class 0 OID 0)
-- Dependencies: 357
-- Name: TABLE shop_with_coords; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.shop_with_coords TO anon;
GRANT ALL ON TABLE public.shop_with_coords TO authenticated;
GRANT ALL ON TABLE public.shop_with_coords TO service_role;


--
-- TOC entry 5043 (class 0 OID 0)
-- Dependencies: 319
-- Name: TABLE user_type; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.user_type TO anon;
GRANT ALL ON TABLE public.user_type TO authenticated;
GRANT ALL ON TABLE public.user_type TO service_role;


--
-- TOC entry 5045 (class 0 OID 0)
-- Dependencies: 318
-- Name: SEQUENCE user_type_user_type_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.user_type_user_type_id_seq TO anon;
GRANT ALL ON SEQUENCE public.user_type_user_type_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.user_type_user_type_id_seq TO service_role;


--
-- TOC entry 5046 (class 0 OID 0)
-- Dependencies: 321
-- Name: TABLE users; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.users TO anon;
GRANT ALL ON TABLE public.users TO authenticated;
GRANT ALL ON TABLE public.users TO service_role;


--
-- TOC entry 5048 (class 0 OID 0)
-- Dependencies: 320
-- Name: SEQUENCE users_user_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.users_user_id_seq TO anon;
GRANT ALL ON SEQUENCE public.users_user_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.users_user_id_seq TO service_role;


--
-- TOC entry 3450 (class 826 OID 30086)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- TOC entry 3453 (class 826 OID 30087)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- TOC entry 3455 (class 826 OID 30088)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- TOC entry 3456 (class 826 OID 30089)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- TOC entry 3457 (class 826 OID 30090)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- TOC entry 3459 (class 826 OID 30091)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO service_role;


-- Completed on 2024-10-04 19:29:53

--
-- PostgreSQL database dump complete
--

