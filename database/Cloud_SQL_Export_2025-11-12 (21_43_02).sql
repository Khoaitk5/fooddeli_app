--
-- PostgreSQL database dump
--

\restrict cb0LaCCquHA3a50m0NH61mAyp0rbUfvOfCV7neJ6JBa0rHukrfhPagftHZdQqch

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: addresses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.addresses (
    address_id integer NOT NULL,
    address_line json,
    lat_lon json,
    note text DEFAULT ''::text,
    address_type character varying(50) DEFAULT 'Nhà'::character varying,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: addresses_address_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.addresses_address_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: addresses_address_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.addresses_address_id_seq OWNED BY public.addresses.address_id;


--
-- Name: cart_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cart_items (
    id integer NOT NULL,
    cart_id integer NOT NULL,
    shop_id integer NOT NULL,
    product_id integer NOT NULL,
    quantity integer NOT NULL,
    unit_price numeric(12,2) NOT NULL,
    line_total numeric(12,2) GENERATED ALWAYS AS (((quantity)::numeric * unit_price)) STORED,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    note text,
    CONSTRAINT cart_items_quantity_check CHECK ((quantity > 0)),
    CONSTRAINT cart_items_unit_price_check CHECK ((unit_price >= (0)::numeric))
);


--
-- Name: cart_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cart_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cart_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cart_items_id_seq OWNED BY public.cart_items.id;


--
-- Name: carts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.carts (
    cart_id integer NOT NULL,
    user_id integer NOT NULL,
    items_count integer DEFAULT 0 NOT NULL,
    subtotal numeric(12,2) DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT carts_items_count_check CHECK ((items_count >= 0)),
    CONSTRAINT carts_subtotal_check CHECK ((subtotal >= (0)::numeric))
);


--
-- Name: carts_cart_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.carts_cart_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: carts_cart_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.carts_cart_id_seq OWNED BY public.carts.cart_id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categories (
    category_id integer NOT NULL,
    category_name character varying(100) NOT NULL
);


--
-- Name: categories_category_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.categories_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: categories_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.categories_category_id_seq OWNED BY public.categories.category_id;


--
-- Name: contracts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.contracts (
    contract_id integer NOT NULL,
    user_id integer NOT NULL,
    contract_date timestamp without time zone DEFAULT now() NOT NULL,
    license_image text,
    tax_code character varying(50),
    commission_rate numeric(5,2) DEFAULT 0.25,
    document_url text,
    status character varying(20) DEFAULT 'pending'::character varying NOT NULL,
    signed_at timestamp without time zone,
    expired_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT contracts_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'active'::character varying, 'terminated'::character varying])::text[])))
);


--
-- Name: contracts_contract_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.contracts_contract_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: contracts_contract_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.contracts_contract_id_seq OWNED BY public.contracts.contract_id;


--
-- Name: follows; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.follows (
    follower_id integer NOT NULL,
    followed_id integer NOT NULL,
    followed_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT follows_check CHECK ((follower_id <> followed_id))
);


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notifications (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    title text NOT NULL,
    body text NOT NULL,
    is_read boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.notifications_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- Name: order_details; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_details (
    id integer NOT NULL,
    order_id integer NOT NULL,
    product_id integer NOT NULL,
    quantity integer NOT NULL,
    unit_price numeric(12,2) NOT NULL,
    line_total numeric(12,2) GENERATED ALWAYS AS (((quantity)::numeric * unit_price)) STORED,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT order_details_quantity_check CHECK ((quantity > 0)),
    CONSTRAINT order_details_unit_price_check CHECK ((unit_price >= (0)::numeric))
);


--
-- Name: order_details_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.order_details_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: order_details_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.order_details_id_seq OWNED BY public.order_details.id;


--
-- Name: order_vouchers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_vouchers (
    order_id integer NOT NULL,
    voucher_id integer NOT NULL
);


--
-- Name: orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.orders (
    order_id integer NOT NULL,
    user_id integer NOT NULL,
    shop_id integer NOT NULL,
    shipper_id integer,
    food_price numeric(12,2) NOT NULL,
    delivery_fee numeric(12,2) DEFAULT 0 NOT NULL,
    total_price numeric(12,2) NOT NULL,
    merchant_commission_rate numeric(5,2) DEFAULT 0.25 NOT NULL,
    shipper_commission_rate numeric(5,2) DEFAULT 0.15 NOT NULL,
    merchant_earn numeric(12,2) DEFAULT 0,
    shipper_earn numeric(12,2) DEFAULT 0,
    admin_earn numeric(12,2) DEFAULT 0,
    status character varying(20) NOT NULL,
    payment_method character varying(20) NOT NULL,
    payment_status character varying(20) DEFAULT 'unpaid'::character varying NOT NULL,
    is_settled boolean DEFAULT false NOT NULL,
    settled_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT orders_delivery_fee_check CHECK ((delivery_fee >= (0)::numeric)),
    CONSTRAINT orders_food_price_check CHECK ((food_price >= (0)::numeric)),
    CONSTRAINT orders_payment_method_check CHECK (((payment_method)::text = ANY ((ARRAY['COD'::character varying, 'VNPay'::character varying])::text[]))),
    CONSTRAINT orders_payment_status_check CHECK (((payment_status)::text = ANY ((ARRAY['unpaid'::character varying, 'paid'::character varying, 'refunded'::character varying])::text[]))),
    CONSTRAINT orders_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'cooking'::character varying, 'shipping'::character varying, 'completed'::character varying, 'cancelled'::character varying])::text[]))),
    CONSTRAINT orders_total_price_check CHECK ((total_price >= (0)::numeric))
);


--
-- Name: orders_order_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.orders_order_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: orders_order_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.orders_order_id_seq OWNED BY public.orders.order_id;


--
-- Name: payments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payments (
    id integer NOT NULL,
    order_id integer NOT NULL,
    provider character varying(50) NOT NULL,
    transaction_code character varying(100),
    amount numeric(12,2) NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying,
    paid_at timestamp without time zone,
    CONSTRAINT payments_amount_check CHECK ((amount >= (0)::numeric)),
    CONSTRAINT payments_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'success'::character varying, 'failed'::character varying, 'refunded'::character varying])::text[])))
);


--
-- Name: payments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payments_id_seq OWNED BY public.payments.id;


--
-- Name: product_category; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_category (
    id integer NOT NULL,
    product_id integer NOT NULL,
    category_id integer NOT NULL
);


--
-- Name: product_category_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.product_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: product_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.product_category_id_seq OWNED BY public.product_category.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.products (
    product_id integer NOT NULL,
    shop_id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    price numeric(12,2) NOT NULL,
    image_url text,
    is_available boolean DEFAULT true NOT NULL,
    category character varying(50) DEFAULT 'Thức ăn'::character varying NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    prep_minutes integer DEFAULT 0,
    CONSTRAINT products_category_check CHECK (((category)::text = ANY ((ARRAY['Thức ăn'::character varying, 'Đồ uống'::character varying, 'Tráng miệng'::character varying, 'Combo'::character varying, 'Khác'::character varying])::text[]))),
    CONSTRAINT products_price_check CHECK ((price >= (0)::numeric))
);


--
-- Name: products_product_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.products_product_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: products_product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.products_product_id_seq OWNED BY public.products.product_id;


--
-- Name: reviews; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reviews (
    review_id integer NOT NULL,
    reviewer_id integer NOT NULL,
    target_id integer NOT NULL,
    target_type character varying(20) NOT NULL,
    rating numeric(2,1) NOT NULL,
    comment text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT reviews_rating_check CHECK (((rating >= (0)::numeric) AND (rating <= (5)::numeric))),
    CONSTRAINT reviews_target_type_check CHECK (((target_type)::text = ANY ((ARRAY['order'::character varying, 'shipper'::character varying, 'user'::character varying, 'shop'::character varying])::text[])))
);


--
-- Name: reviews_review_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.reviews_review_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: reviews_review_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.reviews_review_id_seq OWNED BY public.reviews.review_id;


--
-- Name: shipper_profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.shipper_profiles (
    id integer NOT NULL,
    user_id integer NOT NULL,
    vehicle_type character varying(20) NOT NULL,
    vehicle_number character varying(50),
    identity_card character varying(50),
    status character varying(20) DEFAULT 'pending'::character varying NOT NULL,
    online_status character varying(20) DEFAULT 'offline'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT shipper_profiles_online_status_check CHECK (((online_status)::text = ANY ((ARRAY['online'::character varying, 'offline'::character varying, 'busy'::character varying])::text[]))),
    CONSTRAINT shipper_profiles_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'approved'::character varying, 'rejected'::character varying])::text[]))),
    CONSTRAINT shipper_profiles_vehicle_type_check CHECK (((vehicle_type)::text = ANY ((ARRAY['bike'::character varying, 'motorbike'::character varying, 'car'::character varying])::text[])))
);


--
-- Name: shipper_profiles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.shipper_profiles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: shipper_profiles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.shipper_profiles_id_seq OWNED BY public.shipper_profiles.id;


--
-- Name: shop_profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.shop_profiles (
    id integer NOT NULL,
    user_id integer NOT NULL,
    shop_name character varying(100) NOT NULL,
    shop_address_id integer,
    description text,
    open_hours character varying(50),
    closed_hours character varying(50),
    status character varying(20) DEFAULT 'pending'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT shop_profiles_status_check CHECK (((status)::text = ANY ((ARRAY['open'::character varying, 'closed'::character varying, 'pending'::character varying])::text[])))
);


--
-- Name: shop_profiles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.shop_profiles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: shop_profiles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.shop_profiles_id_seq OWNED BY public.shop_profiles.id;


--
-- Name: user_addresses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_addresses (
    user_id integer NOT NULL,
    address_id integer NOT NULL,
    is_primary boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(255) NOT NULL,
    email character varying(100),
    phone character varying(20),
    rating numeric(2,1),
    full_name character varying(100),
    avatar_url text,
    role character varying(20) NOT NULL,
    status character varying(20) DEFAULT 'active'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT users_rating_check CHECK (((rating >= (0)::numeric) AND (rating <= (5)::numeric))),
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['user'::character varying, 'shop'::character varying, 'shipper'::character varying, 'admin'::character varying])::text[]))),
    CONSTRAINT users_status_check CHECK (((status)::text = ANY ((ARRAY['active'::character varying, 'inactive'::character varying, 'banned'::character varying])::text[])))
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: video_comments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.video_comments (
    comment_id integer NOT NULL,
    video_id integer NOT NULL,
    user_id integer NOT NULL,
    content text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: video_comments_comment_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.video_comments_comment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: video_comments_comment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.video_comments_comment_id_seq OWNED BY public.video_comments.comment_id;


--
-- Name: video_likes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.video_likes (
    video_id integer NOT NULL,
    user_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: videos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.videos (
    video_id integer NOT NULL,
    shop_id integer NOT NULL,
    title character varying(200) NOT NULL,
    description text,
    video_url text NOT NULL,
    duration integer,
    views_count integer DEFAULT 0 NOT NULL,
    likes_count integer DEFAULT 0 NOT NULL,
    comments_count integer DEFAULT 0 NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT videos_duration_check CHECK ((duration >= 0)),
    CONSTRAINT videos_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'approved'::character varying, 'rejected'::character varying, 'hidden'::character varying])::text[])))
);


--
-- Name: videos_video_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.videos_video_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: videos_video_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.videos_video_id_seq OWNED BY public.videos.video_id;


--
-- Name: vouchers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.vouchers (
    voucher_id integer NOT NULL,
    code character varying(50) NOT NULL,
    type character varying(20) NOT NULL,
    discount_value numeric(12,2) NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    min_order_value numeric(12,2),
    max_discount numeric(12,2),
    status character varying(20) DEFAULT 'active'::character varying NOT NULL,
    CONSTRAINT vouchers_check CHECK ((end_date >= start_date)),
    CONSTRAINT vouchers_discount_value_check CHECK ((discount_value > (0)::numeric)),
    CONSTRAINT vouchers_max_discount_check CHECK ((max_discount >= (0)::numeric)),
    CONSTRAINT vouchers_min_order_value_check CHECK ((min_order_value >= (0)::numeric)),
    CONSTRAINT vouchers_status_check CHECK (((status)::text = ANY ((ARRAY['active'::character varying, 'expired'::character varying, 'disabled'::character varying])::text[]))),
    CONSTRAINT vouchers_type_check CHECK (((type)::text = ANY ((ARRAY['order'::character varying, 'shipping'::character varying])::text[])))
);


--
-- Name: vouchers_voucher_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.vouchers_voucher_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: vouchers_voucher_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.vouchers_voucher_id_seq OWNED BY public.vouchers.voucher_id;


--
-- Name: addresses address_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.addresses ALTER COLUMN address_id SET DEFAULT nextval('public.addresses_address_id_seq'::regclass);


--
-- Name: cart_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items ALTER COLUMN id SET DEFAULT nextval('public.cart_items_id_seq'::regclass);


--
-- Name: carts cart_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carts ALTER COLUMN cart_id SET DEFAULT nextval('public.carts_cart_id_seq'::regclass);


--
-- Name: categories category_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories ALTER COLUMN category_id SET DEFAULT nextval('public.categories_category_id_seq'::regclass);


--
-- Name: contracts contract_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contracts ALTER COLUMN contract_id SET DEFAULT nextval('public.contracts_contract_id_seq'::regclass);


--
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- Name: order_details id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_details ALTER COLUMN id SET DEFAULT nextval('public.order_details_id_seq'::regclass);


--
-- Name: orders order_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders ALTER COLUMN order_id SET DEFAULT nextval('public.orders_order_id_seq'::regclass);


--
-- Name: payments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments ALTER COLUMN id SET DEFAULT nextval('public.payments_id_seq'::regclass);


--
-- Name: product_category id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_category ALTER COLUMN id SET DEFAULT nextval('public.product_category_id_seq'::regclass);


--
-- Name: products product_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products ALTER COLUMN product_id SET DEFAULT nextval('public.products_product_id_seq'::regclass);


--
-- Name: reviews review_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews ALTER COLUMN review_id SET DEFAULT nextval('public.reviews_review_id_seq'::regclass);


--
-- Name: shipper_profiles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipper_profiles ALTER COLUMN id SET DEFAULT nextval('public.shipper_profiles_id_seq'::regclass);


--
-- Name: shop_profiles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shop_profiles ALTER COLUMN id SET DEFAULT nextval('public.shop_profiles_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: video_comments comment_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.video_comments ALTER COLUMN comment_id SET DEFAULT nextval('public.video_comments_comment_id_seq'::regclass);


--
-- Name: videos video_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.videos ALTER COLUMN video_id SET DEFAULT nextval('public.videos_video_id_seq'::regclass);


--
-- Name: vouchers voucher_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vouchers ALTER COLUMN voucher_id SET DEFAULT nextval('public.vouchers_voucher_id_seq'::regclass);


--
-- Data for Name: addresses; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.addresses (address_id, address_line, lat_lon, note, address_type, created_at, updated_at) FROM stdin;
20	{"city": "Thành phố Đà Nẵng", "ward": "Phường Nam Dương", "detail": "7 Nguyễn Văn Linh", "district": "Quận Hải Châu"}	\N	Cửa hàng đặc sản số 7 tại trung tâm Đà Nẵng.	Nhà hàng	2025-10-28 06:30:08.673161	2025-10-28 06:30:08.673161
21	{"city": "Thành phố Đà Nẵng", "ward": "Phường Nam Dương", "detail": "8 Nguyễn Văn Linh", "district": "Quận Hải Châu"}	\N	Cửa hàng đặc sản số 8 tại trung tâm Đà Nẵng.	Nhà hàng	2025-10-28 06:30:08.673161	2025-10-28 06:30:08.673161
22	{"city": "Thành phố Đà Nẵng", "ward": "Phường Nam Dương", "detail": "9 Nguyễn Văn Linh", "district": "Quận Hải Châu"}	\N	Cửa hàng đặc sản số 9 tại trung tâm Đà Nẵng.	Nhà hàng	2025-10-28 06:30:08.673161	2025-10-28 06:30:08.673161
23	{"city": "Thành phố Đà Nẵng", "ward": "Phường Nam Dương", "detail": "10 Nguyễn Văn Linh", "district": "Quận Hải Châu"}	\N	Cửa hàng đặc sản số 10 tại trung tâm Đà Nẵng.	Nhà hàng	2025-10-28 06:30:08.673161	2025-10-28 06:30:08.673161
24	{"city": "Thành phố Đà Nẵng", "ward": "Phường Nam Dương", "detail": "11 Nguyễn Văn Linh", "district": "Quận Hải Châu"}	\N	Cửa hàng đặc sản số 11 tại trung tâm Đà Nẵng.	Nhà hàng	2025-10-28 06:30:08.673161	2025-10-28 06:30:08.673161
25	{"city": "Thành phố Đà Nẵng", "ward": "Phường Nam Dương", "detail": "12 Nguyễn Văn Linh", "district": "Quận Hải Châu"}	\N	Cửa hàng đặc sản số 12 tại trung tâm Đà Nẵng.	Nhà hàng	2025-10-28 06:30:08.673161	2025-10-28 06:30:08.673161
26	{"city": "Thành phố Đà Nẵng", "ward": "Phường Nam Dương", "detail": "13 Nguyễn Văn Linh", "district": "Quận Hải Châu"}	\N	Cửa hàng đặc sản số 13 tại trung tâm Đà Nẵng.	Nhà hàng	2025-10-28 06:30:08.673161	2025-10-28 06:30:08.673161
27	{"city": "Thành phố Đà Nẵng", "ward": "Phường Nam Dương", "detail": "14 Nguyễn Văn Linh", "district": "Quận Hải Châu"}	\N	Cửa hàng đặc sản số 14 tại trung tâm Đà Nẵng.	Nhà hàng	2025-10-28 06:30:08.673161	2025-10-28 06:30:08.673161
28	{"city": "Thành phố Đà Nẵng", "ward": "Phường Nam Dương", "detail": "15 Nguyễn Văn Linh", "district": "Quận Hải Châu"}	\N	Cửa hàng đặc sản số 15 tại trung tâm Đà Nẵng.	Nhà hàng	2025-10-28 06:30:08.673161	2025-10-28 06:30:08.673161
29	{"city": "Thành phố Đà Nẵng", "ward": "Phường Nam Dương", "detail": "16 Nguyễn Văn Linh", "district": "Quận Hải Châu"}	\N	Cửa hàng đặc sản số 16 tại trung tâm Đà Nẵng.	Nhà hàng	2025-10-28 06:30:08.673161	2025-10-28 06:30:08.673161
1	{"detail": "26 Thái Phiên", "ward": "Phường Phước Ninh", "district": "Quận Hải Châu", "city": "Thành phố Đà Nẵng"}	{"lat": 16.0649856, "lon": 108.2230299}	Quán bún chả nổi tiếng, đông khách buổi trưa	Nhà hàng	2025-10-28 06:07:55.357512	2025-10-28 06:47:28.6499
3	{"detail": "K280/23 Hoàng Diệu", "ward": "Phường Bình Hiên", "district": "Quận Hải Châu", "city": "Thành phố Đà Nẵng"}	{"lat": 16.106118986200723, "lon": 108.13581246549053}	Bánh xèo giòn ngon, nổi tiếng lâu năm	Nhà hàng	2025-10-28 06:07:55.357512	2025-11-12 12:49:34.807719
4	{"detail": "96 Phan Chu Trinh", "ward": "Phường Hải Châu 1", "district": "Quận Hải Châu", "city": "Thành phố Đà Nẵng"}	{ "lat": 15.8785135, "lon": 108.3243488 }	Cơm gà ngon chuẩn vị Hội An	Nhà hàng	2025-10-28 06:07:55.357512	2025-10-28 06:47:28.6499
5	{"detail": "45 Nguyễn Chí Thanh", "ward": "Phường Hải Châu 1", "district": "Quận Hải Châu", "city": "Thành phố Đà Nẵng"}	{ "lat": 16.078723, "lon": 108.2200849 }	Bún bò cay nồng, vị Huế chính gốc	Nhà hàng	2025-10-28 06:07:55.357512	2025-10-28 06:47:28.6499
6	{"detail": "74 Nguyễn Văn Linh", "ward": "Phường Nam Dương", "district": "Quận Hải Châu", "city": "Thành phố Đà Nẵng"}	{ "lat": 16.0606261, "lon": 108.2144617 }	KFC chi nhánh trung tâm Đà Nẵng, nằm gần cầu Rồng.	Nhà hàng	2025-10-28 06:07:55.357512	2025-10-28 06:47:28.6499
30	{"address": "123 Nguyễn Văn Linh, Hải Châu, Đà Nẵng"}	{"lat": 16.0605, "lon": 108.2145}	Địa chỉ nhà riêng	Nhà	2025-10-28 14:16:31.278923	2025-10-28 14:16:31.278923
31	{"detail":"123","ward":"ben nghe","district":"quan 1","city":"hcm"}	\N		Nhà	2025-10-29 06:44:01.826117	2025-10-29 06:44:01.826117
2	{"detail": "19-21 Trần Bình Trọng", "ward": "Phường Hải Châu 1", "district": "Quận Hải Châu", "city": "Thành phố Đà Nẵng"}	{"lat": 16.071449173415708, "lon": 108.15357940487128}	Mì Quảng trứ danh ở Đà Nẵng, khách du lịch rất đông	Nhà hàng	2025-10-28 06:07:55.357512	2025-11-05 13:10:33.597615
33	{"detail": "126 Phan Đăng Lưu", "ward": "Hoà Cường Bắc", "district": "Hải Châu", "city": "Đà Nẵng"}	{"lat": 16.03636311667848, "lon": 108.21684919795213}	Thực đơn Jollibee đa dạng và phong phú, có rất nhiều sự lựa chọn cho bạn, gia đình và bạn bè.	Nhà hàng	2025-11-11 14:58:07.794321	2025-11-11 14:58:07.794321
\.


--
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cart_items (id, cart_id, shop_id, product_id, quantity, unit_price, created_at, updated_at, note) FROM stdin;
1	1	6	26	1	49000.00	2025-10-28 07:05:45.838732	2025-10-28 07:05:45.838732	\N
2	1	6	28	1	89000.00	2025-10-28 07:05:47.911805	2025-10-28 07:05:47.911805	\N
3	2	1	1	1	45000.00	2025-11-05 16:26:31.813989	2025-11-05 16:26:31.813989	\N
56	3	1	5	2	25000.00	2025-11-06 09:26:00.071123	2025-11-06 09:26:01.92646	\N
59	3	5	22	1	55000.00	2025-11-06 09:58:43.010201	2025-11-12 10:04:26.696481	\N
50	3	1	1	3	45000.00	2025-11-06 09:02:08.468976	2025-11-06 09:27:15.650852	\N
58	3	4	16	1	45000.00	2025-11-06 09:29:39.957521	2025-11-06 09:29:39.957521	\N
60	3	5	21	2	50000.00	2025-11-06 10:01:22.279314	2025-11-06 10:02:18.195029	\N
57	3	1	2	2	35000.00	2025-11-06 09:28:37.539835	2025-11-06 10:03:19.662079	\N
36	6	1	2	1	35000.00	2025-11-06 02:09:54.788196	2025-11-06 02:09:54.788196	\N
37	6	3	15	1	20000.00	2025-11-06 02:10:33.272279	2025-11-06 02:10:33.272279	\N
62	5	1	5	1	25000.00	2025-11-10 16:08:37.126269	2025-11-10 16:08:37.126269	\N
63	5	1	4	1	5000.00	2025-11-10 16:08:38.880091	2025-11-10 16:08:38.880091	\N
64	5	1	3	1	55000.00	2025-11-10 16:08:41.04962	2025-11-10 16:08:41.04962	\N
8	5	3	11	3	35000.00	2025-11-05 17:45:30.837288	2025-11-10 16:26:26.582103	\N
65	5	3	12	1	30000.00	2025-11-10 16:26:27.547123	2025-11-10 16:26:27.547123	\N
66	5	3	13	1	40000.00	2025-11-10 16:26:29.936173	2025-11-10 16:26:29.936173	\N
75	4	4	16	6	45000.00	2025-11-12 05:23:16.572898	2025-11-12 14:37:45.570422	\N
69	5	5	21	1	50000.00	2025-11-11 08:34:27.232042	2025-11-11 08:34:27.232042	\N
11	5	1	1	11	45000.00	2025-11-05 17:52:12.149132	2025-11-11 08:35:18.94491	\N
47	6	1	1	1	45000.00	2025-11-06 08:54:07.16802	2025-11-06 08:54:07.16802	\N
48	6	3	11	1	35000.00	2025-11-06 08:54:12.123583	2025-11-06 08:54:12.123583	\N
49	6	4	17	1	55000.00	2025-11-06 08:54:18.824823	2025-11-06 08:54:18.824823	\N
74	4	5	22	1	55000.00	2025-11-11 13:49:17.933989	2025-11-12 05:23:46.68074	\N
\.


--
-- Data for Name: carts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.carts (cart_id, user_id, items_count, subtotal, created_at, updated_at) FROM stdin;
1	1	2	138000.00	2025-10-28 07:05:33.223549	2025-10-28 07:05:48.058356
2	2	1	45000.00	2025-11-05 16:26:31.758424	2025-11-05 16:26:31.931767
5	89	8	805000.00	2025-11-05 17:45:02.341145	2025-11-11 08:35:19.083368
6	87	5	190000.00	2025-11-05 21:14:38.838519	2025-11-06 08:54:18.915787
7	93	0	0.00	2025-11-06 19:06:33.552781	2025-11-06 19:41:50.774567
3	88	6	455000.00	2025-11-05 16:38:44.614322	2025-11-12 10:04:26.785457
4	3	2	325000.00	2025-11-05 17:40:10.410028	2025-11-12 14:37:45.665874
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.categories (category_id, category_name) FROM stdin;
2	Cơm - Xôi
3	Bún - Phở - Mỳ
4	Trà Sữa - Cà Phê
1	Đồ Ăn Nhanh
\.


--
-- Data for Name: contracts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.contracts (contract_id, user_id, contract_date, license_image, tax_code, commission_rate, document_url, status, signed_at, expired_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: follows; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.follows (follower_id, followed_id, followed_at) FROM stdin;
1	6	2025-10-28 07:05:40.323326
1	2	2025-10-28 13:29:05.629117
2	1	2025-11-04 07:03:36.277993
3	2	2025-11-12 07:12:10.365446
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.notifications (id, user_id, title, body, is_read, created_at) FROM stdin;
\.


--
-- Data for Name: order_details; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.order_details (id, order_id, product_id, quantity, unit_price, created_at, updated_at) FROM stdin;
79	959	13	1	40000.00	2025-11-11 06:53:30.673495	2025-11-11 06:53:30.673495
80	959	12	1	30000.00	2025-11-11 06:53:30.673495	2025-11-11 06:53:30.673495
81	959	11	3	35000.00	2025-11-11 06:53:30.673495	2025-11-11 06:53:30.673495
82	960	3	1	55000.00	2025-11-11 08:40:43.671806	2025-11-11 08:40:43.671806
83	960	4	1	5000.00	2025-11-11 08:40:43.671806	2025-11-11 08:40:43.671806
84	960	5	1	25000.00	2025-11-11 08:40:43.671806	2025-11-11 08:40:43.671806
85	960	1	11	45000.00	2025-11-11 08:40:43.671806	2025-11-11 08:40:43.671806
86	961	3	1	55000.00	2025-11-11 08:45:22.436694	2025-11-11 08:45:22.436694
87	961	4	1	5000.00	2025-11-11 08:45:22.436694	2025-11-11 08:45:22.436694
15	926	11	2	35000.00	2025-11-05 20:38:07.650395	2025-11-05 20:38:07.650395
10	923	11	1	35000.00	2025-11-05 20:38:07.650395	2025-11-05 20:38:07.650395
17	927	12	1	30000.00	2025-11-05 20:38:07.650395	2025-11-05 20:38:07.650395
11	923	12	1	30000.00	2025-11-05 20:38:07.650395	2025-11-05 20:38:07.650395
16	926	13	1	40000.00	2025-11-05 20:38:07.650395	2025-11-05 20:38:07.650395
12	924	13	1	40000.00	2025-11-05 20:38:07.650395	2025-11-05 20:38:07.650395
18	927	15	1	20000.00	2025-11-05 20:38:07.650395	2025-11-05 20:38:07.650395
14	925	15	1	20000.00	2025-11-05 20:38:07.650395	2025-11-05 20:38:07.650395
13	924	14	2	15000.00	2025-11-05 20:38:07.650395	2025-11-05 20:38:07.650395
19	928	6	2	30000.00	2025-11-06 04:47:50.588479	2025-11-06 04:47:50.588479
20	928	7	1	45000.00	2025-11-06 04:47:50.588479	2025-11-06 04:47:50.588479
21	928	8	3	25000.00	2025-11-06 04:47:50.588479	2025-11-06 04:47:50.588479
22	928	9	1	60000.00	2025-11-06 04:47:50.588479	2025-11-06 04:47:50.588479
23	928	10	2	20000.00	2025-11-06 04:47:50.588479	2025-11-06 04:47:50.588479
24	929	6	1	30000.00	2025-11-06 05:05:24.235101	2025-11-06 05:05:24.235101
25	929	8	2	25000.00	2025-11-06 05:05:24.235101	2025-11-06 05:05:24.235101
26	929	9	1	60000.00	2025-11-06 05:05:24.235101	2025-11-06 05:05:24.235101
27	929	10	3	20000.00	2025-11-06 05:05:24.235101	2025-11-06 05:05:24.235101
88	961	5	1	25000.00	2025-11-11 08:45:22.436694	2025-11-11 08:45:22.436694
89	961	1	3	45000.00	2025-11-11 08:45:22.436694	2025-11-11 08:45:22.436694
90	962	5	1	25000.00	2025-11-11 08:54:06.117384	2025-11-11 08:54:06.117384
91	962	1	5	45000.00	2025-11-11 08:54:06.117384	2025-11-11 08:54:06.117384
92	963	3	1	55000.00	2025-11-11 08:57:11.258896	2025-11-11 08:57:11.258896
93	963	4	1	5000.00	2025-11-11 08:57:11.258896	2025-11-11 08:57:11.258896
94	963	5	1	25000.00	2025-11-11 08:57:11.258896	2025-11-11 08:57:11.258896
95	963	1	3	45000.00	2025-11-11 08:57:11.258896	2025-11-11 08:57:11.258896
96	964	11	2	35000.00	2025-11-11 09:18:02.94696	2025-11-11 09:18:02.94696
97	965	21	1	50000.00	2025-11-11 13:16:16.486246	2025-11-11 13:16:16.486246
98	965	22	2	55000.00	2025-11-11 13:16:16.486246	2025-11-11 13:16:16.486246
99	966	2	2	35000.00	2025-11-12 09:59:04.208809	2025-11-12 09:59:04.208809
100	966	5	2	25000.00	2025-11-12 09:59:04.208809	2025-11-12 09:59:04.208809
101	966	1	3	45000.00	2025-11-12 09:59:04.208809	2025-11-12 09:59:04.208809
76	958	13	1	40000.00	2025-11-11 06:16:40.08569	2025-11-11 06:16:40.08569
77	958	12	1	30000.00	2025-11-11 06:16:40.08569	2025-11-11 06:16:40.08569
78	958	11	3	35000.00	2025-11-11 06:16:40.08569	2025-11-11 06:16:40.08569
\.


--
-- Data for Name: order_vouchers; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.order_vouchers (order_id, voucher_id) FROM stdin;
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.orders (order_id, user_id, shop_id, shipper_id, food_price, delivery_fee, total_price, merchant_commission_rate, shipper_commission_rate, merchant_earn, shipper_earn, admin_earn, status, payment_method, payment_status, is_settled, settled_at, created_at, updated_at) FROM stdin;
966	88	1	\N	255000.00	15000.00	270000.00	0.25	0.15	191250.00	12750.00	66000.00	pending	COD	unpaid	f	\N	2025-11-12 09:59:04.145483	2025-11-12 09:59:04.552507
8	70	6	20	40909.00	10000.00	50909.00	0.25	0.15	30681.75	8500.00	11727.25	completed	COD	paid	t	\N	2024-01-03 00:00:00	2024-01-03 00:00:00
13	79	6	17	93023.00	10000.00	103023.00	0.25	0.15	69767.25	8500.00	24755.75	completed	COD	paid	t	\N	2024-01-08 00:00:00	2024-01-08 00:00:00
14	75	6	16	40058.00	10000.00	50058.00	0.25	0.15	30043.50	8500.00	11514.50	completed	COD	paid	t	\N	2024-01-09 00:00:00	2024-01-09 00:00:00
17	83	1	25	54886.00	10000.00	64886.00	0.25	0.15	41164.50	8500.00	15221.50	completed	COD	paid	t	\N	2024-01-12 00:00:00	2024-01-12 00:00:00
18	84	5	17	104009.00	10000.00	114009.00	0.25	0.15	78006.75	8500.00	27502.25	completed	COD	paid	t	\N	2024-01-13 00:00:00	2024-01-13 00:00:00
21	81	5	19	65373.00	10000.00	75373.00	0.25	0.15	49029.75	8500.00	17843.25	completed	COD	paid	t	\N	2024-01-16 00:00:00	2024-01-16 00:00:00
24	83	4	16	64880.00	10000.00	74880.00	0.25	0.15	48660.00	8500.00	17720.00	completed	COD	paid	t	\N	2024-01-19 00:00:00	2024-01-19 00:00:00
25	78	4	24	61799.00	10000.00	71799.00	0.25	0.15	46349.25	8500.00	16949.75	completed	COD	paid	t	\N	2024-01-20 00:00:00	2024-01-20 00:00:00
28	80	6	25	92688.00	10000.00	102688.00	0.25	0.15	69516.00	8500.00	24672.00	completed	COD	paid	t	\N	2024-01-10 00:00:00	2024-01-10 00:00:00
33	70	6	14	74541.00	10000.00	84541.00	0.25	0.15	55905.75	8500.00	20135.25	completed	COD	paid	t	\N	2024-01-15 00:00:00	2024-01-15 00:00:00
39	72	6	18	104536.00	10000.00	114536.00	0.25	0.15	78402.00	8500.00	27634.00	completed	COD	paid	t	\N	2024-01-21 00:00:00	2024-01-21 00:00:00
43	76	5	25	78918.00	10000.00	88918.00	0.25	0.15	59188.50	8500.00	21229.50	completed	COD	paid	t	\N	2024-01-25 00:00:00	2024-01-25 00:00:00
46	76	6	21	90779.00	10000.00	100779.00	0.25	0.15	68084.25	8500.00	24194.75	completed	COD	paid	t	\N	2024-01-28 00:00:00	2024-01-28 00:00:00
48	83	5	14	96371.00	10000.00	106371.00	0.25	0.15	72278.25	8500.00	25592.75	completed	COD	paid	t	\N	2024-01-17 00:00:00	2024-01-17 00:00:00
53	72	4	25	112751.00	10000.00	122751.00	0.25	0.15	84563.25	8500.00	29687.75	completed	COD	paid	t	\N	2024-01-22 00:00:00	2024-01-22 00:00:00
62	72	1	20	60465.00	10000.00	70465.00	0.25	0.15	45348.75	8500.00	16616.25	completed	COD	paid	t	\N	2024-01-31 00:00:00	2024-01-31 00:00:00
69	76	5	19	35080.00	10000.00	45080.00	0.25	0.15	26310.00	8500.00	10270.00	completed	COD	paid	t	\N	2024-01-25 00:00:00	2024-01-25 00:00:00
71	82	4	18	57983.00	10000.00	67983.00	0.25	0.15	43487.25	8500.00	15995.75	completed	COD	paid	t	\N	2024-01-27 00:00:00	2024-01-27 00:00:00
73	70	6	23	50934.00	10000.00	60934.00	0.25	0.15	38200.50	8500.00	14233.50	completed	COD	paid	t	\N	2024-01-29 00:00:00	2024-01-29 00:00:00
76	82	1	20	91169.00	10000.00	101169.00	0.25	0.15	68376.75	8500.00	24292.25	completed	COD	paid	t	\N	2024-02-01 00:00:00	2024-02-01 00:00:00
77	79	4	13	105881.00	10000.00	115881.00	0.25	0.15	79410.75	8500.00	27970.25	completed	COD	paid	t	\N	2024-02-02 00:00:00	2024-02-02 00:00:00
79	81	4	20	74560.00	10000.00	84560.00	0.25	0.15	55920.00	8500.00	20140.00	completed	COD	paid	t	\N	2024-02-04 00:00:00	2024-02-04 00:00:00
84	70	1	19	43002.00	10000.00	53002.00	0.25	0.15	32251.50	8500.00	12250.50	completed	COD	paid	t	\N	2024-02-09 00:00:00	2024-02-09 00:00:00
86	76	4	19	119730.00	10000.00	129730.00	0.25	0.15	89797.50	8500.00	31432.50	completed	COD	paid	t	\N	2024-02-11 00:00:00	2024-02-11 00:00:00
90	83	6	13	62577.00	10000.00	72577.00	0.25	0.15	46932.75	8500.00	17144.25	completed	COD	paid	t	\N	2024-02-05 00:00:00	2024-02-05 00:00:00
102	82	4	13	65377.00	10000.00	75377.00	0.25	0.15	49032.75	8500.00	17844.25	completed	COD	paid	t	\N	2024-02-17 00:00:00	2024-02-17 00:00:00
104	74	1	16	34617.00	10000.00	44617.00	0.25	0.15	25962.75	8500.00	10154.25	completed	COD	paid	t	\N	2024-02-19 00:00:00	2024-02-19 00:00:00
118	81	1	11	65386.00	10000.00	75386.00	0.25	0.15	49039.50	8500.00	17846.50	completed	COD	paid	t	\N	2024-02-20 00:00:00	2024-02-20 00:00:00
122	75	5	17	33013.00	10000.00	43013.00	0.25	0.15	24759.75	8500.00	9753.25	completed	COD	paid	t	\N	2024-02-24 00:00:00	2024-02-24 00:00:00
128	74	6	15	51301.00	10000.00	61301.00	0.25	0.15	38475.75	8500.00	14325.25	completed	COD	paid	t	\N	2024-02-17 00:00:00	2024-02-17 00:00:00
136	81	4	15	76773.00	10000.00	86773.00	0.25	0.15	57579.75	8500.00	20693.25	completed	COD	paid	t	\N	2024-02-25 00:00:00	2024-02-25 00:00:00
139	72	6	14	73476.00	10000.00	83476.00	0.25	0.15	55107.00	8500.00	19869.00	completed	COD	paid	t	\N	2024-02-28 00:00:00	2024-02-28 00:00:00
140	80	6	18	53110.00	10000.00	63110.00	0.25	0.15	39832.50	8500.00	14777.50	completed	COD	paid	t	\N	2024-02-29 00:00:00	2024-02-29 00:00:00
141	82	4	23	38286.00	10000.00	48286.00	0.25	0.15	28714.50	8500.00	11071.50	completed	COD	paid	t	\N	2024-03-01 00:00:00	2024-03-01 00:00:00
142	72	1	19	111750.00	10000.00	121750.00	0.25	0.15	83812.50	8500.00	29437.50	completed	COD	paid	t	\N	2024-03-02 00:00:00	2024-03-02 00:00:00
145	84	5	25	112856.00	10000.00	122856.00	0.25	0.15	84642.00	8500.00	29714.00	completed	COD	paid	t	\N	2024-03-05 00:00:00	2024-03-05 00:00:00
151	77	1	13	32642.00	10000.00	42642.00	0.25	0.15	24481.50	8500.00	9660.50	completed	COD	paid	t	\N	2024-02-27 00:00:00	2024-02-27 00:00:00
154	71	5	22	82117.00	10000.00	92117.00	0.25	0.15	61587.75	8500.00	22029.25	completed	COD	paid	t	\N	2024-03-01 00:00:00	2024-03-01 00:00:00
161	84	4	24	35889.00	10000.00	45889.00	0.25	0.15	26916.75	8500.00	10472.25	completed	COD	paid	t	\N	2024-03-08 00:00:00	2024-03-08 00:00:00
162	71	1	22	111733.00	10000.00	121733.00	0.25	0.15	83799.75	8500.00	29433.25	completed	COD	paid	t	\N	2024-03-09 00:00:00	2024-03-09 00:00:00
163	75	6	15	97599.00	10000.00	107599.00	0.25	0.15	73199.25	8500.00	25899.75	completed	COD	paid	t	\N	2024-03-10 00:00:00	2024-03-10 00:00:00
164	70	5	17	82377.00	10000.00	92377.00	0.25	0.15	61782.75	8500.00	22094.25	completed	COD	paid	t	\N	2024-03-11 00:00:00	2024-03-11 00:00:00
169	71	6	19	44342.00	10000.00	54342.00	0.25	0.15	33256.50	8500.00	12585.50	completed	COD	paid	t	\N	2024-03-04 00:00:00	2024-03-04 00:00:00
185	79	6	17	83508.00	10000.00	93508.00	0.25	0.15	62631.00	8500.00	22377.00	completed	COD	paid	t	\N	2024-03-20 00:00:00	2024-03-20 00:00:00
187	80	6	13	45438.00	10000.00	55438.00	0.25	0.15	34078.50	8500.00	12859.50	completed	COD	paid	t	\N	2024-03-09 00:00:00	2024-03-09 00:00:00
201	72	1	20	98353.00	10000.00	108353.00	0.25	0.15	73764.75	8500.00	26088.25	completed	COD	paid	t	\N	2024-03-23 00:00:00	2024-03-23 00:00:00
202	72	4	15	82773.00	10000.00	92773.00	0.25	0.15	62079.75	8500.00	22193.25	completed	COD	paid	t	\N	2024-03-24 00:00:00	2024-03-24 00:00:00
206	80	1	25	114033.00	10000.00	124033.00	0.25	0.15	85524.75	8500.00	30008.25	completed	COD	paid	t	\N	2024-03-28 00:00:00	2024-03-28 00:00:00
210	80	4	15	32864.00	10000.00	42864.00	0.25	0.15	24648.00	8500.00	9716.00	completed	COD	paid	t	\N	2024-03-19 00:00:00	2024-03-19 00:00:00
211	74	5	24	85452.00	10000.00	95452.00	0.25	0.15	64089.00	8500.00	22863.00	completed	COD	paid	t	\N	2024-03-20 00:00:00	2024-03-20 00:00:00
212	80	6	24	51612.00	10000.00	61612.00	0.25	0.15	38709.00	8500.00	14403.00	completed	COD	paid	t	\N	2024-03-21 00:00:00	2024-03-21 00:00:00
213	77	4	18	71136.00	10000.00	81136.00	0.25	0.15	53352.00	8500.00	19284.00	completed	COD	paid	t	\N	2024-03-22 00:00:00	2024-03-22 00:00:00
215	70	5	25	31131.00	10000.00	41131.00	0.25	0.15	23348.25	8500.00	9282.75	completed	COD	paid	t	\N	2024-03-24 00:00:00	2024-03-24 00:00:00
219	83	1	13	79891.00	10000.00	89891.00	0.25	0.15	59918.25	8500.00	21472.75	completed	COD	paid	t	\N	2024-03-28 00:00:00	2024-03-28 00:00:00
220	71	6	25	77233.00	10000.00	87233.00	0.25	0.15	57924.75	8500.00	20808.25	completed	COD	paid	t	\N	2024-03-29 00:00:00	2024-03-29 00:00:00
958	89	3	28	175000.00	15000.00	190000.00	0.25	0.15	131250.00	12750.00	46000.00	completed	COD	unpaid	f	\N	2025-11-11 06:16:39.848767	2025-11-11 06:16:40.849017
223	74	5	11	62250.00	10000.00	72250.00	0.25	0.15	46687.50	8500.00	17062.50	completed	COD	paid	t	\N	2024-04-01 00:00:00	2024-04-01 00:00:00
226	75	5	13	103633.00	10000.00	113633.00	0.25	0.15	77724.75	8500.00	27408.25	completed	COD	paid	t	\N	2024-04-04 00:00:00	2024-04-04 00:00:00
234	73	4	25	91852.00	10000.00	101852.00	0.25	0.15	68889.00	8500.00	24463.00	completed	COD	paid	t	\N	2024-03-30 00:00:00	2024-03-30 00:00:00
236	82	1	24	36190.00	10000.00	46190.00	0.25	0.15	27142.50	8500.00	10547.50	completed	COD	paid	t	\N	2024-04-01 00:00:00	2024-04-01 00:00:00
237	81	6	21	108329.00	10000.00	118329.00	0.25	0.15	81246.75	8500.00	28582.25	completed	COD	paid	t	\N	2024-04-02 00:00:00	2024-04-02 00:00:00
242	79	4	21	115548.00	10000.00	125548.00	0.25	0.15	86661.00	8500.00	30387.00	completed	COD	paid	t	\N	2024-04-07 00:00:00	2024-04-07 00:00:00
925	74	3	\N	20000.00	10000.00	30000.00	0.10	0.05	18.00	0.75	1.25	pending	COD	unpaid	f	\N	2025-11-05 20:33:32.953949	2025-11-05 20:33:32.953949
251	77	5	11	65632.00	10000.00	75632.00	0.25	0.15	49224.00	8500.00	17908.00	completed	COD	paid	t	\N	2024-04-06 00:00:00	2024-04-06 00:00:00
252	82	4	23	39833.00	10000.00	49833.00	0.25	0.15	29874.75	8500.00	11458.25	completed	COD	paid	t	\N	2024-04-07 00:00:00	2024-04-07 00:00:00
926	75	3	\N	110000.00	10000.00	120000.00	0.10	0.05	10.80	0.40	0.80	pending	COD	unpaid	f	\N	2025-11-05 20:33:32.953949	2025-11-05 20:33:32.953949
255	80	4	25	107777.00	10000.00	117777.00	0.25	0.15	80832.75	8500.00	28444.25	completed	COD	paid	t	\N	2024-04-10 00:00:00	2024-04-10 00:00:00
959	89	3	28	175000.00	15000.00	190000.00	0.25	0.15	131250.00	12750.00	46000.00	pending	COD	unpaid	f	\N	2025-11-11 06:53:30.607835	2025-11-11 06:53:31.049905
271	81	6	25	33811.00	10000.00	43811.00	0.25	0.15	25358.25	8500.00	9952.75	completed	COD	paid	t	\N	2024-04-13 00:00:00	2024-04-13 00:00:00
927	76	3	\N	50000.00	10000.00	60000.00	0.10	0.05	16.20	0.55	1.25	pending	COD	unpaid	f	\N	2025-11-05 20:33:32.953949	2025-11-10 18:20:52.967881
278	79	4	16	34301.00	10000.00	44301.00	0.25	0.15	25725.75	8500.00	10075.25	completed	COD	paid	t	\N	2024-04-20 00:00:00	2024-04-20 00:00:00
279	81	1	25	114966.00	10000.00	124966.00	0.25	0.15	86224.50	8500.00	30241.50	completed	COD	paid	t	\N	2024-04-21 00:00:00	2024-04-21 00:00:00
280	76	1	23	117490.00	10000.00	127490.00	0.25	0.15	88117.50	8500.00	30872.50	completed	COD	paid	t	\N	2024-04-22 00:00:00	2024-04-22 00:00:00
923	1	3	28	65000.00	10000.00	75000.00	0.10	0.05	9.00	20000.00	0.50	completed	COD	unpaid	f	\N	2025-11-05 20:33:32.953949	2025-11-12 14:42:43.236623
924	2	3	28	70000.00	10000.00	80000.00	0.10	0.05	13.50	35000.00	0.90	cooking	COD	unpaid	f	\N	2025-11-05 20:33:32.953949	2025-11-12 14:42:46.833739
283	79	5	17	115916.00	10000.00	125916.00	0.25	0.15	86937.00	8500.00	30479.00	completed	COD	paid	t	\N	2024-04-25 00:00:00	2024-04-25 00:00:00
285	77	1	19	88245.00	10000.00	98245.00	0.25	0.15	66183.75	8500.00	23561.25	completed	COD	paid	t	\N	2024-04-27 00:00:00	2024-04-27 00:00:00
290	71	1	16	100953.00	10000.00	110953.00	0.25	0.15	75714.75	8500.00	26738.25	completed	COD	paid	t	\N	2024-04-19 00:00:00	2024-04-19 00:00:00
928	3	2	\N	250000.00	20000.00	270000.00	0.25	0.15	0.00	0.00	0.00	pending	COD	unpaid	f	\N	2025-11-06 04:47:33.893203	2025-11-06 04:47:33.893203
292	80	6	20	98577.00	10000.00	108577.00	0.25	0.15	73932.75	8500.00	26144.25	completed	COD	paid	t	\N	2024-04-21 00:00:00	2024-04-21 00:00:00
293	71	4	13	84869.00	10000.00	94869.00	0.25	0.15	63651.75	8500.00	22717.25	completed	COD	paid	t	\N	2024-04-22 00:00:00	2024-04-22 00:00:00
297	75	6	18	65253.00	10000.00	75253.00	0.25	0.15	48939.75	8500.00	17813.25	completed	COD	paid	t	\N	2024-04-26 00:00:00	2024-04-26 00:00:00
298	82	1	17	74352.00	10000.00	84352.00	0.25	0.15	55764.00	8500.00	20088.00	completed	COD	paid	t	\N	2024-04-27 00:00:00	2024-04-27 00:00:00
301	72	6	25	60546.00	10000.00	70546.00	0.25	0.15	45409.50	8500.00	16636.50	completed	COD	paid	t	\N	2024-04-30 00:00:00	2024-04-30 00:00:00
305	80	5	19	54785.00	10000.00	64785.00	0.25	0.15	41088.75	8500.00	15196.25	completed	COD	paid	t	\N	2024-05-04 00:00:00	2024-05-04 00:00:00
307	76	5	17	54988.00	10000.00	64988.00	0.25	0.15	41241.00	8500.00	15247.00	completed	COD	paid	t	\N	2024-04-23 00:00:00	2024-04-23 00:00:00
960	89	1	\N	580000.00	15000.00	595000.00	0.25	0.15	435000.00	12750.00	147250.00	pending	COD	unpaid	f	\N	2025-11-11 08:40:43.606666	2025-11-11 08:40:44.038147
312	72	6	23	52751.00	10000.00	62751.00	0.25	0.15	39563.25	8500.00	14687.75	completed	COD	paid	t	\N	2024-04-28 00:00:00	2024-04-28 00:00:00
316	77	5	23	116276.00	10000.00	126276.00	0.25	0.15	87207.00	8500.00	30569.00	completed	COD	paid	t	\N	2024-05-02 00:00:00	2024-05-02 00:00:00
319	77	6	13	66105.00	10000.00	76105.00	0.25	0.15	49578.75	8500.00	18026.25	completed	COD	paid	t	\N	2024-05-05 00:00:00	2024-05-05 00:00:00
324	83	1	15	37954.00	10000.00	47954.00	0.25	0.15	28465.50	8500.00	10988.50	completed	COD	paid	t	\N	2024-05-10 00:00:00	2024-05-10 00:00:00
327	71	6	21	70115.00	10000.00	80115.00	0.25	0.15	52586.25	8500.00	19028.75	completed	COD	paid	t	\N	2024-05-02 00:00:00	2024-05-02 00:00:00
334	82	1	22	107259.00	10000.00	117259.00	0.25	0.15	80444.25	8500.00	28314.75	completed	COD	paid	t	\N	2024-05-09 00:00:00	2024-05-09 00:00:00
336	74	5	24	33216.00	10000.00	43216.00	0.25	0.15	24912.00	8500.00	9804.00	completed	COD	paid	t	\N	2024-05-11 00:00:00	2024-05-11 00:00:00
339	72	4	21	117817.00	10000.00	127817.00	0.25	0.15	88362.75	8500.00	30954.25	completed	COD	paid	t	\N	2024-05-14 00:00:00	2024-05-14 00:00:00
344	83	1	24	41996.00	10000.00	51996.00	0.25	0.15	31497.00	8500.00	11999.00	completed	COD	paid	t	\N	2024-05-19 00:00:00	2024-05-19 00:00:00
347	73	5	20	87652.00	10000.00	97652.00	0.25	0.15	65739.00	8500.00	23413.00	completed	COD	paid	t	\N	2024-05-09 00:00:00	2024-05-09 00:00:00
348	77	5	12	90554.00	10000.00	100554.00	0.25	0.15	67915.50	8500.00	24138.50	completed	COD	paid	t	\N	2024-05-10 00:00:00	2024-05-10 00:00:00
353	79	1	23	90117.00	10000.00	100117.00	0.25	0.15	67587.75	8500.00	24029.25	completed	COD	paid	t	\N	2024-05-15 00:00:00	2024-05-15 00:00:00
929	3	2	28	180000.00	15000.00	195000.00	0.25	0.15	0.00	0.00	0.00	completed	COD	unpaid	f	\N	2025-11-06 05:05:12.326315	2025-11-06 08:33:19.216685
358	76	6	17	40556.00	10000.00	50556.00	0.25	0.15	30417.00	8500.00	11639.00	completed	COD	paid	t	\N	2024-05-20 00:00:00	2024-05-20 00:00:00
366	76	6	21	108477.00	10000.00	118477.00	0.25	0.15	81357.75	8500.00	28619.25	completed	COD	paid	t	\N	2024-05-28 00:00:00	2024-05-28 00:00:00
367	80	1	18	104342.00	10000.00	114342.00	0.25	0.15	78256.50	8500.00	27585.50	completed	COD	paid	t	\N	2024-05-16 00:00:00	2024-05-16 00:00:00
961	89	1	\N	220000.00	15000.00	235000.00	0.25	0.15	165000.00	12750.00	57250.00	pending	COD	unpaid	f	\N	2025-11-11 08:45:22.373374	2025-11-11 08:45:22.769937
372	74	6	24	80524.00	10000.00	90524.00	0.25	0.15	60393.00	8500.00	21631.00	completed	COD	paid	t	\N	2024-05-21 00:00:00	2024-05-21 00:00:00
373	81	4	15	88555.00	10000.00	98555.00	0.25	0.15	66416.25	8500.00	23638.75	completed	COD	paid	t	\N	2024-05-22 00:00:00	2024-05-22 00:00:00
375	73	4	19	34636.00	10000.00	44636.00	0.25	0.15	25977.00	8500.00	10159.00	completed	COD	paid	t	\N	2024-05-24 00:00:00	2024-05-24 00:00:00
379	73	4	22	54158.00	10000.00	64158.00	0.25	0.15	40618.50	8500.00	15039.50	completed	COD	paid	t	\N	2024-05-28 00:00:00	2024-05-28 00:00:00
385	70	6	14	81733.00	10000.00	91733.00	0.25	0.15	61299.75	8500.00	21933.25	completed	COD	paid	t	\N	2024-06-03 00:00:00	2024-06-03 00:00:00
394	77	6	23	38271.00	10000.00	48271.00	0.25	0.15	28703.25	8500.00	11067.75	completed	COD	paid	t	\N	2024-05-30 00:00:00	2024-05-30 00:00:00
395	83	6	12	54875.00	10000.00	64875.00	0.25	0.15	41156.25	8500.00	15218.75	completed	COD	paid	t	\N	2024-05-31 00:00:00	2024-05-31 00:00:00
396	73	4	20	51563.00	10000.00	61563.00	0.25	0.15	38672.25	8500.00	14390.75	completed	COD	paid	t	\N	2024-06-01 00:00:00	2024-06-01 00:00:00
397	76	6	19	113549.00	10000.00	123549.00	0.25	0.15	85161.75	8500.00	29887.25	completed	COD	paid	t	\N	2024-06-02 00:00:00	2024-06-02 00:00:00
403	84	5	13	48759.00	10000.00	58759.00	0.25	0.15	36569.25	8500.00	13689.75	completed	COD	paid	t	\N	2024-06-08 00:00:00	2024-06-08 00:00:00
405	76	1	19	41245.00	10000.00	51245.00	0.25	0.15	30933.75	8500.00	11811.25	completed	COD	paid	t	\N	2024-06-10 00:00:00	2024-06-10 00:00:00
962	89	1	\N	250000.00	15000.00	265000.00	0.25	0.15	187500.00	12750.00	64750.00	pending	COD	unpaid	f	\N	2025-11-11 08:54:06.062155	2025-11-11 08:54:06.451341
421	80	6	13	45869.00	10000.00	55869.00	0.25	0.15	34401.75	8500.00	12967.25	completed	COD	paid	t	\N	2024-06-16 00:00:00	2024-06-16 00:00:00
422	76	5	15	55596.00	10000.00	65596.00	0.25	0.15	41697.00	8500.00	15399.00	completed	COD	paid	t	\N	2024-06-17 00:00:00	2024-06-17 00:00:00
423	79	4	13	100968.00	10000.00	110968.00	0.25	0.15	75726.00	8500.00	26742.00	completed	COD	paid	t	\N	2024-06-18 00:00:00	2024-06-18 00:00:00
425	71	6	25	84296.00	10000.00	94296.00	0.25	0.15	63222.00	8500.00	22574.00	completed	COD	paid	t	\N	2024-06-20 00:00:00	2024-06-20 00:00:00
426	71	6	16	40393.00	10000.00	50393.00	0.25	0.15	30294.75	8500.00	11598.25	completed	COD	paid	t	\N	2024-06-21 00:00:00	2024-06-21 00:00:00
430	74	4	23	35550.00	10000.00	45550.00	0.25	0.15	26662.50	8500.00	10387.50	completed	COD	paid	t	\N	2024-06-12 00:00:00	2024-06-12 00:00:00
434	79	6	24	112168.00	10000.00	122168.00	0.25	0.15	84126.00	8500.00	29542.00	completed	COD	paid	t	\N	2024-06-16 00:00:00	2024-06-16 00:00:00
435	75	1	20	73805.00	10000.00	83805.00	0.25	0.15	55353.75	8500.00	19951.25	completed	COD	paid	t	\N	2024-06-17 00:00:00	2024-06-17 00:00:00
436	80	6	12	89890.00	10000.00	99890.00	0.25	0.15	67417.50	8500.00	23972.50	completed	COD	paid	t	\N	2024-06-18 00:00:00	2024-06-18 00:00:00
447	78	5	25	68994.00	10000.00	78994.00	0.25	0.15	51745.50	8500.00	18748.50	completed	COD	paid	t	\N	2024-06-16 00:00:00	2024-06-16 00:00:00
449	70	5	11	63459.00	10000.00	73459.00	0.25	0.15	47594.25	8500.00	17364.75	completed	COD	paid	t	\N	2024-06-18 00:00:00	2024-06-18 00:00:00
450	73	6	13	52581.00	10000.00	62581.00	0.25	0.15	39435.75	8500.00	14645.25	completed	COD	paid	t	\N	2024-06-19 00:00:00	2024-06-19 00:00:00
453	82	6	11	72609.00	10000.00	82609.00	0.25	0.15	54456.75	8500.00	19652.25	completed	COD	paid	t	\N	2024-06-22 00:00:00	2024-06-22 00:00:00
464	75	6	25	61706.00	10000.00	71706.00	0.25	0.15	46279.50	8500.00	16926.50	completed	COD	paid	t	\N	2024-07-03 00:00:00	2024-07-03 00:00:00
930	1	2	\N	0.00	15000.00	15000.00	0.25	0.15	0.00	0.00	0.00	pending	COD	unpaid	f	\N	2025-11-06 07:47:25.268321	2025-11-06 07:47:25.268321
946	87	4	\N	0.00	15000.00	15000.00	0.25	0.15	0.00	0.00	0.00	pending	COD	unpaid	f	\N	2025-11-10 16:23:36.780161	2025-11-10 16:23:36.780161
469	73	5	17	118578.00	10000.00	128578.00	0.25	0.15	88933.50	8500.00	31144.50	completed	COD	paid	t	\N	2024-06-25 00:00:00	2024-06-25 00:00:00
471	77	5	15	75444.00	10000.00	85444.00	0.25	0.15	56583.00	8500.00	20361.00	completed	COD	paid	t	\N	2024-06-27 00:00:00	2024-06-27 00:00:00
475	81	1	23	69893.00	10000.00	79893.00	0.25	0.15	52419.75	8500.00	18973.25	completed	COD	paid	t	\N	2024-07-01 00:00:00	2024-07-01 00:00:00
479	73	6	21	70707.00	10000.00	80707.00	0.25	0.15	53030.25	8500.00	19176.75	completed	COD	paid	t	\N	2024-07-05 00:00:00	2024-07-05 00:00:00
963	89	1	\N	220000.00	15000.00	235000.00	0.25	0.15	165000.00	12750.00	57250.00	pending	COD	unpaid	f	\N	2025-11-11 08:57:11.214903	2025-11-11 08:57:11.515617
483	79	4	14	74163.00	10000.00	84163.00	0.25	0.15	55622.25	8500.00	20040.75	completed	COD	paid	t	\N	2024-07-09 00:00:00	2024-07-09 00:00:00
497	73	5	22	34741.00	10000.00	44741.00	0.25	0.15	26055.75	8500.00	10185.25	completed	COD	paid	t	\N	2024-07-12 00:00:00	2024-07-12 00:00:00
504	79	6	17	117474.00	10000.00	127474.00	0.25	0.15	88105.50	8500.00	30868.50	completed	COD	paid	t	\N	2024-07-19 00:00:00	2024-07-19 00:00:00
506	81	6	16	54381.00	10000.00	64381.00	0.25	0.15	40785.75	8500.00	15095.25	completed	COD	paid	t	\N	2024-07-21 00:00:00	2024-07-21 00:00:00
508	73	4	13	103954.00	10000.00	113954.00	0.25	0.15	77965.50	8500.00	27488.50	completed	COD	paid	t	\N	2024-07-10 00:00:00	2024-07-10 00:00:00
511	72	1	25	37002.00	10000.00	47002.00	0.25	0.15	27751.50	8500.00	10750.50	completed	COD	paid	t	\N	2024-07-13 00:00:00	2024-07-13 00:00:00
514	81	6	22	91177.00	10000.00	101177.00	0.25	0.15	68382.75	8500.00	24294.25	completed	COD	paid	t	\N	2024-07-16 00:00:00	2024-07-16 00:00:00
517	80	6	17	46745.00	10000.00	56745.00	0.25	0.15	35058.75	8500.00	13186.25	completed	COD	paid	t	\N	2024-07-19 00:00:00	2024-07-19 00:00:00
519	72	6	17	99985.00	10000.00	109985.00	0.25	0.15	74988.75	8500.00	26496.25	completed	COD	paid	t	\N	2024-07-21 00:00:00	2024-07-21 00:00:00
520	84	5	23	74830.00	10000.00	84830.00	0.25	0.15	56122.50	8500.00	20207.50	completed	COD	paid	t	\N	2024-07-22 00:00:00	2024-07-22 00:00:00
526	84	5	17	70765.00	10000.00	80765.00	0.25	0.15	53073.75	8500.00	19191.25	completed	COD	paid	t	\N	2024-07-28 00:00:00	2024-07-28 00:00:00
530	76	4	23	41675.00	10000.00	51675.00	0.25	0.15	31256.25	8500.00	11918.75	completed	COD	paid	t	\N	2024-07-19 00:00:00	2024-07-19 00:00:00
533	83	6	11	73669.00	10000.00	83669.00	0.25	0.15	55251.75	8500.00	19917.25	completed	COD	paid	t	\N	2024-07-22 00:00:00	2024-07-22 00:00:00
964	89	3	\N	70000.00	15000.00	85000.00	0.25	0.15	52500.00	12750.00	19750.00	pending	COD	unpaid	f	\N	2025-11-11 09:18:02.885973	2025-11-11 09:18:03.360995
547	81	1	25	46590.00	10000.00	56590.00	0.25	0.15	34942.50	8500.00	13147.50	completed	COD	paid	t	\N	2024-07-23 00:00:00	2024-07-23 00:00:00
552	84	4	22	81584.00	10000.00	91584.00	0.25	0.15	61188.00	8500.00	21896.00	completed	COD	paid	t	\N	2024-07-28 00:00:00	2024-07-28 00:00:00
554	74	6	20	82316.00	10000.00	92316.00	0.25	0.15	61737.00	8500.00	22079.00	completed	COD	paid	t	\N	2024-07-30 00:00:00	2024-07-30 00:00:00
558	74	6	17	76917.00	10000.00	86917.00	0.25	0.15	57687.75	8500.00	20729.25	completed	COD	paid	t	\N	2024-08-03 00:00:00	2024-08-03 00:00:00
559	70	5	11	89196.00	10000.00	99196.00	0.25	0.15	66897.00	8500.00	23799.00	completed	COD	paid	t	\N	2024-08-04 00:00:00	2024-08-04 00:00:00
568	83	5	23	35019.00	10000.00	45019.00	0.25	0.15	26264.25	8500.00	10254.75	completed	COD	paid	t	\N	2024-08-03 00:00:00	2024-08-03 00:00:00
571	82	4	24	52009.00	10000.00	62009.00	0.25	0.15	39006.75	8500.00	14502.25	completed	COD	paid	t	\N	2024-08-06 00:00:00	2024-08-06 00:00:00
573	75	5	18	86648.00	10000.00	96648.00	0.25	0.15	64986.00	8500.00	23162.00	completed	COD	paid	t	\N	2024-08-08 00:00:00	2024-08-08 00:00:00
585	73	4	19	80853.00	10000.00	90853.00	0.25	0.15	60639.75	8500.00	21713.25	completed	COD	paid	t	\N	2024-08-20 00:00:00	2024-08-20 00:00:00
965	3	5	\N	160000.00	15000.00	175000.00	0.25	0.15	120000.00	12750.00	42250.00	pending	COD	unpaid	f	\N	2025-11-11 13:16:16.421255	2025-11-11 13:16:16.829623
589	75	1	16	37904.00	10000.00	47904.00	0.25	0.15	28428.00	8500.00	10976.00	completed	COD	paid	t	\N	2024-08-11 00:00:00	2024-08-11 00:00:00
595	70	4	11	117208.00	10000.00	127208.00	0.25	0.15	87906.00	8500.00	30802.00	completed	COD	paid	t	\N	2024-08-17 00:00:00	2024-08-17 00:00:00
599	84	1	12	95575.00	10000.00	105575.00	0.25	0.15	71681.25	8500.00	25393.75	completed	COD	paid	t	\N	2024-08-21 00:00:00	2024-08-21 00:00:00
607	79	1	11	98159.00	10000.00	108159.00	0.25	0.15	73619.25	8500.00	26039.75	completed	COD	paid	t	\N	2024-08-16 00:00:00	2024-08-16 00:00:00
613	73	4	16	68932.00	10000.00	78932.00	0.25	0.15	51699.00	8500.00	18733.00	completed	COD	paid	t	\N	2024-08-22 00:00:00	2024-08-22 00:00:00
614	80	6	25	111065.00	10000.00	121065.00	0.25	0.15	83298.75	8500.00	29266.25	completed	COD	paid	t	\N	2024-08-23 00:00:00	2024-08-23 00:00:00
623	77	6	13	91270.00	10000.00	101270.00	0.25	0.15	68452.50	8500.00	24317.50	completed	COD	paid	t	\N	2024-09-01 00:00:00	2024-09-01 00:00:00
629	84	1	19	55652.00	10000.00	65652.00	0.25	0.15	41739.00	8500.00	15413.00	completed	COD	paid	t	\N	2024-08-25 00:00:00	2024-08-25 00:00:00
630	80	1	13	52387.00	10000.00	62387.00	0.25	0.15	39290.25	8500.00	14596.75	completed	COD	paid	t	\N	2024-08-26 00:00:00	2024-08-26 00:00:00
632	80	6	17	94138.00	10000.00	104138.00	0.25	0.15	70603.50	8500.00	25034.50	completed	COD	paid	t	\N	2024-08-28 00:00:00	2024-08-28 00:00:00
633	72	6	19	43062.00	10000.00	53062.00	0.25	0.15	32296.50	8500.00	12265.50	completed	COD	paid	t	\N	2024-08-29 00:00:00	2024-08-29 00:00:00
635	80	4	12	101138.00	10000.00	111138.00	0.25	0.15	75853.50	8500.00	26784.50	completed	COD	paid	t	\N	2024-08-31 00:00:00	2024-08-31 00:00:00
639	84	1	19	62806.00	10000.00	72806.00	0.25	0.15	47104.50	8500.00	17201.50	completed	COD	paid	t	\N	2024-09-04 00:00:00	2024-09-04 00:00:00
645	77	1	23	50641.00	10000.00	60641.00	0.25	0.15	37980.75	8500.00	14160.25	completed	COD	paid	t	\N	2024-09-10 00:00:00	2024-09-10 00:00:00
646	76	1	21	96633.00	10000.00	106633.00	0.25	0.15	72474.75	8500.00	25658.25	completed	COD	paid	t	\N	2024-09-11 00:00:00	2024-09-11 00:00:00
662	83	4	11	104962.00	10000.00	114962.00	0.25	0.15	78721.50	8500.00	27740.50	completed	COD	paid	t	\N	2024-09-17 00:00:00	2024-09-17 00:00:00
663	70	1	18	92204.00	10000.00	102204.00	0.25	0.15	69153.00	8500.00	24551.00	completed	COD	paid	t	\N	2024-09-18 00:00:00	2024-09-18 00:00:00
670	70	5	20	43568.00	10000.00	53568.00	0.25	0.15	32676.00	8500.00	12392.00	completed	COD	paid	t	\N	2024-09-12 00:00:00	2024-09-12 00:00:00
673	79	6	22	32182.00	10000.00	42182.00	0.25	0.15	24136.50	8500.00	9545.50	completed	COD	paid	t	\N	2024-09-15 00:00:00	2024-09-15 00:00:00
684	77	6	13	118437.00	10000.00	128437.00	0.25	0.15	88827.75	8500.00	31109.25	completed	COD	paid	t	\N	2024-09-26 00:00:00	2024-09-26 00:00:00
690	74	1	13	75336.00	10000.00	85336.00	0.25	0.15	56502.00	8500.00	20334.00	completed	COD	paid	t	\N	2024-09-19 00:00:00	2024-09-19 00:00:00
694	77	4	23	39947.00	10000.00	49947.00	0.25	0.15	29960.25	8500.00	11486.75	completed	COD	paid	t	\N	2024-09-23 00:00:00	2024-09-23 00:00:00
696	80	1	11	44846.00	10000.00	54846.00	0.25	0.15	33634.50	8500.00	12711.50	completed	COD	paid	t	\N	2024-09-25 00:00:00	2024-09-25 00:00:00
699	70	1	20	88172.00	10000.00	98172.00	0.25	0.15	66129.00	8500.00	23543.00	completed	COD	paid	t	\N	2024-09-28 00:00:00	2024-09-28 00:00:00
950	87	1	\N	0.00	15000.00	15000.00	0.25	0.15	0.00	0.00	0.00	pending	COD	unpaid	f	\N	2025-11-10 16:29:42.098386	2025-11-10 16:29:42.098386
704	70	5	13	44836.00	10000.00	54836.00	0.25	0.15	33627.00	8500.00	12709.00	completed	COD	paid	t	\N	2024-10-03 00:00:00	2024-10-03 00:00:00
705	77	6	15	94026.00	10000.00	104026.00	0.25	0.15	70519.50	8500.00	25006.50	completed	COD	paid	t	\N	2024-10-04 00:00:00	2024-10-04 00:00:00
714	76	4	25	67677.00	10000.00	77677.00	0.25	0.15	50757.75	8500.00	18419.25	completed	COD	paid	t	\N	2024-09-30 00:00:00	2024-09-30 00:00:00
715	80	6	23	44269.00	10000.00	54269.00	0.25	0.15	33201.75	8500.00	12567.25	completed	COD	paid	t	\N	2024-10-01 00:00:00	2024-10-01 00:00:00
716	75	1	21	100533.00	10000.00	110533.00	0.25	0.15	75399.75	8500.00	26633.25	completed	COD	paid	t	\N	2024-10-02 00:00:00	2024-10-02 00:00:00
720	83	6	15	104041.00	10000.00	114041.00	0.25	0.15	78030.75	8500.00	27510.25	completed	COD	paid	t	\N	2024-10-06 00:00:00	2024-10-06 00:00:00
721	81	5	12	81888.00	10000.00	91888.00	0.25	0.15	61416.00	8500.00	21972.00	completed	COD	paid	t	\N	2024-10-07 00:00:00	2024-10-07 00:00:00
723	80	6	15	32369.00	10000.00	42369.00	0.25	0.15	24276.75	8500.00	9592.25	completed	COD	paid	t	\N	2024-10-09 00:00:00	2024-10-09 00:00:00
728	77	4	16	94604.00	10000.00	104604.00	0.25	0.15	70953.00	8500.00	25151.00	completed	COD	paid	t	\N	2024-10-03 00:00:00	2024-10-03 00:00:00
738	79	5	13	102679.00	10000.00	112679.00	0.25	0.15	77009.25	8500.00	27169.75	completed	COD	paid	t	\N	2024-10-13 00:00:00	2024-10-13 00:00:00
739	78	1	18	71621.00	10000.00	81621.00	0.25	0.15	53715.75	8500.00	19405.25	completed	COD	paid	t	\N	2024-10-14 00:00:00	2024-10-14 00:00:00
746	80	4	23	47709.00	10000.00	57709.00	0.25	0.15	35781.75	8500.00	13427.25	completed	COD	paid	t	\N	2024-10-21 00:00:00	2024-10-21 00:00:00
755	74	5	24	49096.00	10000.00	59096.00	0.25	0.15	36822.00	8500.00	13774.00	completed	COD	paid	t	\N	2024-10-17 00:00:00	2024-10-17 00:00:00
758	81	5	12	53932.00	10000.00	63932.00	0.25	0.15	40449.00	8500.00	14983.00	completed	COD	paid	t	\N	2024-10-20 00:00:00	2024-10-20 00:00:00
759	71	5	24	96461.00	10000.00	106461.00	0.25	0.15	72345.75	8500.00	25615.25	completed	COD	paid	t	\N	2024-10-21 00:00:00	2024-10-21 00:00:00
760	70	1	17	72236.00	10000.00	82236.00	0.25	0.15	54177.00	8500.00	19559.00	completed	COD	paid	t	\N	2024-10-22 00:00:00	2024-10-22 00:00:00
761	71	1	13	34293.00	10000.00	44293.00	0.25	0.15	25719.75	8500.00	10073.25	completed	COD	paid	t	\N	2024-10-23 00:00:00	2024-10-23 00:00:00
762	80	4	17	76634.00	10000.00	86634.00	0.25	0.15	57475.50	8500.00	20658.50	completed	COD	paid	t	\N	2024-10-24 00:00:00	2024-10-24 00:00:00
767	83	6	13	56292.00	10000.00	66292.00	0.25	0.15	42219.00	8500.00	15573.00	completed	COD	paid	t	\N	2024-10-16 00:00:00	2024-10-16 00:00:00
951	87	1	\N	0.00	15000.00	15000.00	0.25	0.15	0.00	0.00	0.00	pending	COD	unpaid	f	\N	2025-11-10 16:31:53.914525	2025-11-10 16:31:53.914525
783	82	6	17	106772.00	10000.00	116772.00	0.25	0.15	80079.00	8500.00	28193.00	completed	COD	paid	t	\N	2024-11-01 00:00:00	2024-11-01 00:00:00
792	70	6	13	110349.00	10000.00	120349.00	0.25	0.15	82761.75	8500.00	29087.25	completed	COD	paid	t	\N	2024-10-28 00:00:00	2024-10-28 00:00:00
797	77	4	17	41111.00	10000.00	51111.00	0.25	0.15	30833.25	8500.00	11777.75	completed	COD	paid	t	\N	2024-11-02 00:00:00	2024-11-02 00:00:00
800	72	1	23	55203.00	10000.00	65203.00	0.25	0.15	41402.25	8500.00	15300.75	completed	COD	paid	t	\N	2024-11-05 00:00:00	2024-11-05 00:00:00
801	74	6	24	35773.00	10000.00	45773.00	0.25	0.15	26829.75	8500.00	10443.25	completed	COD	paid	t	\N	2024-11-06 00:00:00	2024-11-06 00:00:00
803	72	5	16	41934.00	10000.00	51934.00	0.25	0.15	31450.50	8500.00	11983.50	completed	COD	paid	t	\N	2024-11-08 00:00:00	2024-11-08 00:00:00
804	80	1	15	52577.00	10000.00	62577.00	0.25	0.15	39432.75	8500.00	14644.25	completed	COD	paid	t	\N	2024-11-09 00:00:00	2024-11-09 00:00:00
858	72	5	16	83498.00	10791.00	94289.00	0.25	0.15	62623.50	9172.35	22493.15	completed	COD	paid	t	\N	2025-10-25 08:28:30.156496	2025-10-25 08:28:30.156496
861	72	1	21	116698.00	10260.00	126958.00	0.25	0.15	87523.50	8721.00	30713.50	completed	COD	paid	t	\N	2025-10-22 08:28:30.156496	2025-10-22 08:28:30.156496
862	76	1	17	97290.00	13667.00	110957.00	0.25	0.15	72967.50	11616.95	26372.55	completed	COD	paid	t	\N	2025-10-27 08:28:30.156496	2025-10-27 08:28:30.156496
866	80	6	13	66920.00	14559.00	81479.00	0.25	0.15	50190.00	12375.15	18913.85	completed	VNPay	paid	t	\N	2025-10-23 08:28:30.156496	2025-10-23 08:28:30.156496
867	78	4	17	85335.00	11059.00	96394.00	0.25	0.15	64001.25	9400.15	22992.60	completed	VNPay	paid	t	\N	2025-10-25 08:28:30.156496	2025-10-25 08:28:30.156496
868	73	5	20	66252.00	14945.00	81197.00	0.25	0.15	49689.00	12703.25	18804.75	completed	VNPay	paid	t	\N	2025-10-24 08:28:30.156496	2025-10-24 08:28:30.156496
870	72	4	19	56955.00	11135.00	68090.00	0.25	0.15	42716.25	9464.75	15909.00	completed	VNPay	paid	t	\N	2025-10-24 08:28:30.156496	2025-10-24 08:28:30.156496
871	84	6	17	78828.00	11178.00	90006.00	0.25	0.15	59121.00	9501.30	21383.70	completed	COD	paid	t	\N	2025-10-23 08:28:30.156496	2025-10-23 08:28:30.156496
880	76	1	15	85449.00	14951.00	100400.00	0.25	0.15	64086.75	12708.35	23604.90	completed	COD	paid	t	\N	2025-10-24 08:28:30.156496	2025-10-24 08:28:30.156496
881	72	1	18	102671.00	8727.00	111398.00	0.25	0.15	77003.25	7417.95	26976.80	completed	VNPay	paid	t	\N	2025-10-23 08:28:30.156496	2025-10-23 08:28:30.156496
885	82	6	18	139583.00	9108.00	148691.00	0.25	0.15	104687.25	7741.80	36261.95	completed	COD	paid	t	\N	2025-10-23 08:28:30.156496	2025-10-23 08:28:30.156496
886	72	6	14	92412.00	14585.00	106997.00	0.25	0.15	69309.00	12397.25	25290.75	completed	COD	paid	t	\N	2025-10-23 08:28:30.156496	2025-10-23 08:28:30.156496
901	79	5	20	140253.00	14140.00	154393.00	0.25	0.15	105189.75	12019.00	37184.25	completed	COD	paid	t	\N	2025-10-25 08:28:30.156496	2025-10-25 08:28:30.156496
902	83	4	13	117580.00	8818.00	126398.00	0.25	0.15	88185.00	7495.30	30717.70	completed	VNPay	paid	t	\N	2025-10-25 08:28:30.156496	2025-10-25 08:28:30.156496
903	74	6	20	147017.00	8344.00	155361.00	0.25	0.15	110262.75	7092.40	38005.85	completed	VNPay	paid	t	\N	2025-10-25 08:28:30.156496	2025-10-25 08:28:30.156496
7	3	2	\N	108593.00	10000.00	118593.00	0.25	0.15	81444.75	8500.00	28648.25	cooking	COD	paid	t	\N	2024-01-02 00:00:00	2025-11-06 08:00:10.69612
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payments (id, order_id, provider, transaction_code, amount, status, paid_at) FROM stdin;
\.


--
-- Data for Name: product_category; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_category (id, product_id, category_id) FROM stdin;
1	1	3
2	3	3
3	4	4
4	6	3
5	8	3
6	10	4
7	14	4
8	16	2
9	17	2
10	20	4
11	21	3
12	22	3
13	23	3
14	25	4
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.products (product_id, shop_id, name, description, price, image_url, is_available, category, updated_at, prep_minutes) FROM stdin;
1	1	Bún chả truyền thống	Thịt nướng thơm, nước chấm đậm đà, rau sống tươi.	45000.00	https://firebasestorage.googleapis.com/v0/b/fooddeli-6d394.firebasestorage.app/o/images%2Fproduct%2Fbun_cha_truyen_thong.jpg?alt=media&token=e6946d92-77a7-4881-8e7b-6096422389c6	t	Thức ăn	2025-10-28 06:07:55.357512	0
2	1	Nem rán Hà Nội	Nem rán giòn, nhân thịt và miến, ăn kèm rau sống.	35000.00	https://firebasestorage.googleapis.com/v0/b/fooddeli-6d394.firebasestorage.app/o/images%2Fproduct%2Fnem_ran_ha_noi.png?alt=media&token=e206195e-9537-41f1-85c9-a2454e175369	t	Thức ăn	2025-10-28 06:07:55.357512	0
3	1	Bún chả thập cẩm	Thịt viên, thịt nướng và nem rán trong cùng một phần.	55000.00	https://firebasestorage.googleapis.com/v0/b/fooddeli-6d394.firebasestorage.app/o/images%2Fproduct%2Fbun_cha_thap_cam.jpg?alt=media&token=d0243420-9759-43d2-a231-6b262d6d5d63	t	Thức ăn	2025-10-28 06:07:55.357512	0
4	1	Trà đá Hà Nội	Thức uống mát lạnh, dùng kèm bún chả.	5000.00	https://firebasestorage.googleapis.com/v0/b/fooddeli-6d394.firebasestorage.app/o/images%2Fproduct%2Ftra_da.jpg?alt=media&token=e5bf54e6-4f7b-4f08-87f1-f0275c27ac2f	t	Đồ uống	2025-10-28 06:07:55.357512	0
92	31	Trà Chanh Hạt Chia	Với hương vị chua chua ngọt ngọt hòa quyện, thêm hạt chia vui miệng, chỉ với 20.000đ/ ly.	20000.00	https://firebasestorage.googleapis.com/v0/b/fooddeli-6d394.firebasestorage.app/o/images%2Fproduct%2Ftra_chanh_hat_chia.jpg?alt=media&token=c41d2fc1-ee41-4b10-a3f5-c383e71395a3	t	Đồ uống	2025-11-11 15:13:18.654976	0
5	1	Chè khúc bạch	Món tráng miệng thanh mát với sữa và hạnh nhân.	25000.00	https://firebasestorage.googleapis.com/v0/b/fooddeli-6d394.firebasestorage.app/o/images%2Fproduct%2Fche_khuc_bach.webp?alt=media&token=b6aa1936-ae40-4eb2-aac5-64c05539b415	t	Tráng miệng	2025-10-28 06:07:55.357512	0
6	2	Mì Quảng Gà	Mì Quảng gà xé, nước dùng béo ngậy và đậm đà.	40000.00	https://firebasestorage.googleapis.com/v0/b/fooddeli-6d394.firebasestorage.app/o/images%2Fproduct%2Fmi_quang_ga.jpg?alt=media&token=8ec36c60-d68d-48ed-b020-ba6bd463b64b	t	Thức ăn	2025-10-28 06:07:55.357512	0
9	2	Bánh tráng mè	Bánh tráng nướng giòn ăn kèm mì quảng.	10000.00	https://firebasestorage.googleapis.com/v0/b/fooddeli-6d394.firebasestorage.app/o/images%2Fproduct%2Fbanh_trang_me.png?alt=media&token=73f18a01-250f-4ec0-8e9e-13b77ae04e96	t	Thức ăn	2025-10-28 06:07:55.357512	0
11	3	Bánh xèo tôm thịt	Bánh xèo giòn rụm, nhân tôm thịt thơm ngon.	35000.00	https://firebasestorage.googleapis.com/v0/b/fooddeli-6d394.firebasestorage.app/o/images%2Fproduct%2Fbanh_xeo_tom_thit.jpg?alt=media&token=60a8e759-ddb1-4c9c-b30c-79c4d4760a53	t	Thức ăn	2025-10-28 06:07:55.357512	0
12	3	Ram cuốn cải	Ram rán cuốn cải, chấm nước mắm chua ngọt.	30000.00	https://firebasestorage.googleapis.com/v0/b/fooddeli-6d394.firebasestorage.app/o/images%2Fproduct%2Fram_cuon_cai.jpg?alt=media&token=fe45af32-00d0-410c-b8c9-5450e9342fd3	t	Thức ăn	2025-10-28 06:07:55.357512	0
13	3	Bánh xèo đặc biệt	Nhân đầy đặn, nước chấm đậm vị, ăn cực đã.	40000.00	https://firebasestorage.googleapis.com/v0/b/fooddeli-6d394.firebasestorage.app/o/images%2Fproduct%2Fbanh_xeo_dac_biet.webp?alt=media&token=db6b34a4-491c-4220-a065-7e604b778116	t	Thức ăn	2025-10-28 06:07:55.357512	0
15	3	Chè bắp	Món tráng miệng dân dã từ bắp tươi.	20000.00	https://firebasestorage.googleapis.com/v0/b/fooddeli-6d394.firebasestorage.app/o/images%2Fproduct%2Fche_bap.jpg?alt=media&token=a2550015-20e3-43aa-ac12-fd546f2e4042	t	Tráng miệng	2025-10-28 06:07:55.357512	0
16	4	Cơm Gà Hội An	Cơm gà xé, rau răm, hành phi, vị chuẩn Hội An.	45000.00	https://firebasestorage.googleapis.com/v0/b/fooddeli-6d394.firebasestorage.app/o/images%2Fproduct%2Fcom_ga_hoi_an.jpg?alt=media&token=e4012801-8bfa-45bd-94e0-3c487dedd9a4	t	Thức ăn	2025-10-28 06:07:55.357512	0
17	4	Cơm Gà Chiên	Gà chiên giòn, cơm vàng ươm, ăn cùng nước mắm tỏi.	55000.00	https://firebasestorage.googleapis.com/v0/b/fooddeli-6d394.firebasestorage.app/o/images%2Fproduct%2Fcom_ga_chien.jpeg?alt=media&token=0bb4a0ee-490e-4090-ad16-ecbe535856ec	t	Thức ăn	2025-10-28 06:07:55.357512	0
18	4	Gỏi Gà Xé	Gỏi chua ngọt, thịt gà mềm dai, rau thơm hấp dẫn.	50000.00	https://firebasestorage.googleapis.com/v0/b/fooddeli-6d394.firebasestorage.app/o/images%2Fproduct%2Fgoi_ga_xe.jpg?alt=media&token=5dac5a82-b914-4f58-870c-be3a0a22ddb2	t	Thức ăn	2025-10-28 06:07:55.357512	0
19	4	Canh Rau Củ	Canh thanh mát ăn kèm cơm.	20000.00	https://firebasestorage.googleapis.com/v0/b/fooddeli-6d394.firebasestorage.app/o/images%2Fproduct%2Fcanh_rau_cu.jpg?alt=media&token=f9d4c220-981e-453b-994f-c21e7c9e4ee5	t	Thức ăn	2025-10-28 06:07:55.357512	0
20	4	Trà Tắc	Thức uống giải nhiệt, chua ngọt vừa miệng.	10000.00	https://firebasestorage.googleapis.com/v0/b/fooddeli-6d394.firebasestorage.app/o/images%2Fproduct%2Ftra_tac.jpg?alt=media&token=aa0d6eae-202b-4026-b365-bdad9df1ca2a	t	Đồ uống	2025-10-28 06:07:55.357512	0
21	5	Bún Bò Huế Đặc Biệt	Giò heo, chả, thịt bò hầm, nước dùng cay đậm.	50000.00	https://firebasestorage.googleapis.com/v0/b/fooddeli-6d394.firebasestorage.app/o/images%2Fproduct%2Fbun_bo_hue_dac_biet.jpg?alt=media&token=9bb42af9-88ad-442f-9967-5435344ce3c8	t	Thức ăn	2025-10-28 06:07:55.357512	0
22	5	Bún Bò Giò Heo	Giò heo hầm mềm, nước lèo đậm vị Huế.	55000.00	https://firebasestorage.googleapis.com/v0/b/fooddeli-6d394.firebasestorage.app/o/images%2Fproduct%2Fbun_bo_gio_heo.webp?alt=media&token=c12b08fc-09be-4f7d-b3a2-30d26facf6c2	t	Thức ăn	2025-10-28 06:07:55.357512	0
23	5	Bún Bò Tái Nạm	Thịt bò tái nạm, nước dùng cay nhẹ.	48000.00	https://firebasestorage.googleapis.com/v0/b/fooddeli-6d394.firebasestorage.app/o/images%2Fproduct%2Fbun_bo_tai_nam.png?alt=media&token=7179695c-8d4a-4d04-b69c-e4af835ad75e	t	Thức ăn	2025-10-28 06:07:55.357512	0
24	5	Chè Hạt Sen	Giải nhiệt sau bữa ăn, thanh mát nhẹ nhàng.	25000.00	https://firebasestorage.googleapis.com/v0/b/fooddeli-6d394.firebasestorage.app/o/images%2Fproduct%2Fche_hat_sen.jpg?alt=media&token=ddae41e9-c47d-4ea3-a822-642207172bde	t	Tráng miệng	2025-10-28 06:07:55.357512	0
25	5	Trà Chanh	Đồ uống thanh mát, giải khát cực nhanh.	10000.00	https://firebasestorage.googleapis.com/v0/b/fooddeli-6d394.firebasestorage.app/o/images%2Fproduct%2Ftra_chanh.jpg?alt=media&token=162ba1fa-b90a-4a8d-b1b6-345b308ea03e	t	Đồ uống	2025-10-28 06:07:55.357512	0
26	6	Gà Rán Truyền Thống	Miếng gà rán giòn rụm, hương vị đặc trưng của KFC. Thịt mềm, lớp vỏ vàng ươm thơm lừng.	49000.00	https://firebasestorage.googleapis.com/v0/b/fooddeli-6d394.firebasestorage.app/o/images%2Fproduct%2Fga_ran_truyen_thong.png?alt=media&token=a2e974dc-159c-4b34-a8fb-4f7785e65f6b	t	Thức ăn	2025-10-28 06:07:55.357512	0
27	6	Burger Gà Giòn Cay	Burger gà giòn cay với rau tươi và sốt mayonnaise đặc biệt, bữa ăn nhanh tiện lợi.	65000.00	https://firebasestorage.googleapis.com/v0/b/fooddeli-6d394.firebasestorage.app/o/images%2Fproduct%2Fburger_ga_gion_cay.jpg?alt=media&token=f34293d2-338a-44da-9b7c-e49d26dc8404	t	Thức ăn	2025-10-28 06:07:55.357512	0
28	6	Combo Gà Rán + Khoai + Pepsi	1 miếng gà rán, 1 phần khoai tây chiên và 1 ly Pepsi mát lạnh – combo kinh điển của KFC.	89000.00	https://firebasestorage.googleapis.com/v0/b/fooddeli-6d394.firebasestorage.app/o/images%2Fproduct%2Fcom_bo_ga_ran_khoai_pepsi.png?alt=media&token=e7175002-2b3e-4657-aafa-081008568e98	t	Combo	2025-10-28 06:07:55.357512	0
29	6	Cơm Gà Sốt Tiêu Đen	Cơm nóng ăn cùng gà chiên phủ sốt tiêu đen thơm cay – món ăn no ngon hấp dẫn.	59000.00	https://firebasestorage.googleapis.com/v0/b/fooddeli-6d394.firebasestorage.app/o/images%2Fproduct%2Fcom_ga_sot_tieu_den.jpg?alt=media&token=40d25227-9dae-4588-a8b0-a5c9956fa43e	t	Thức ăn	2025-10-28 06:07:55.357512	0
30	6	Kem Ly Sundae	Kem tươi mát lạnh phủ sốt chocolate hoặc caramel, món tráng miệng yêu thích tại KFC.	25000.00	https://firebasestorage.googleapis.com/v0/b/fooddeli-6d394.firebasestorage.app/o/images%2Fproduct%2Fkem_ly_sundae.jpg?alt=media&token=82a59eec-1970-4f57-a266-04a53ffcf03e	t	Tráng miệng	2025-10-28 06:07:55.357512	0
8	2	Mì Quảng Ếch	Ếch xào thơm ngon, nước dùng đặc biệt hấp dẫn.	50000.00	https://firebasestorage.googleapis.com/v0/b/fooddeli-6d394.firebasestorage.app/o/images%2Fproduct%2Fmi_quang_ech.webp?alt=media&token=a0b6b406-ce4b-41f7-91e4-a9bce8ebaa1a	t	Thức ăn	2025-10-28 06:07:55.357512	0
10	2	Sâm bí đao	Thức uống giải khát thanh nhiệt cơ thể.	15000.00	https://firebasestorage.googleapis.com/v0/b/fooddeli-6d394.firebasestorage.app/o/images%2Fproduct%2Fsam_bi_dao.png?alt=media&token=840adc71-3629-4edd-84ba-b4cc3ae55e2a	t	Đồ uống	2025-10-28 06:07:55.357512	0
14	3	Nước mía	Đồ uống truyền thống ngọt thanh mát.	15000.00	https://firebasestorage.googleapis.com/v0/b/fooddeli-6d394.firebasestorage.app/o/images%2Fproduct%2Fnuoc_mia.webp?alt=media&token=622684d1-6f61-452a-a54e-09de67c1d6ff	t	Đồ uống	2025-10-28 06:07:55.357512	0
7	2	Mì Quảng Tôm Thịt	Tôm tươi, thịt heo và đậu phộng rang.	46000.00	https://firebasestorage.googleapis.com/v0/b/fooddeli-6d394.firebasestorage.app/o/images%2Fproduct%2Fmi_quang_tom_thit.png?alt=media&token=6ec4b217-7f66-4ac3-91ef-494310731045	t	Thức ăn	2025-11-05 16:25:07.116125	0
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.reviews (review_id, reviewer_id, target_id, target_type, rating, comment, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: shipper_profiles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.shipper_profiles (id, user_id, vehicle_type, vehicle_number, identity_card, status, online_status, created_at, updated_at) FROM stdin;
11	55	car	43H-1011	\N	approved	offline	2025-10-28 06:30:08.673161	2025-10-28 06:30:08.673161
12	56	bike	43H-1012	\N	approved	online	2025-10-28 06:30:08.673161	2025-10-28 06:30:08.673161
13	57	motorbike	43H-1013	\N	approved	offline	2025-10-28 06:30:08.673161	2025-10-28 06:30:08.673161
14	58	car	43H-1014	\N	approved	online	2025-10-28 06:30:08.673161	2025-10-28 06:30:08.673161
15	59	bike	43H-1015	\N	approved	offline	2025-10-28 06:30:08.673161	2025-10-28 06:30:08.673161
16	60	motorbike	43H-1016	\N	approved	online	2025-10-28 06:30:08.673161	2025-10-28 06:30:08.673161
17	61	car	43H-1017	\N	approved	offline	2025-10-28 06:30:08.673161	2025-10-28 06:30:08.673161
18	62	bike	43H-1018	\N	approved	online	2025-10-28 06:30:08.673161	2025-10-28 06:30:08.673161
19	63	motorbike	43H-1019	\N	approved	offline	2025-10-28 06:30:08.673161	2025-10-28 06:30:08.673161
20	64	car	43H-1020	\N	approved	online	2025-10-28 06:30:08.673161	2025-10-28 06:30:08.673161
21	65	bike	43H-1021	\N	approved	offline	2025-10-28 06:30:08.673161	2025-10-28 06:30:08.673161
22	66	motorbike	43H-1022	\N	approved	online	2025-10-28 06:30:08.673161	2025-10-28 06:30:08.673161
23	67	car	43H-1023	\N	approved	offline	2025-10-28 06:30:08.673161	2025-10-28 06:30:08.673161
24	68	bike	43H-1024	\N	approved	online	2025-10-28 06:30:08.673161	2025-10-28 06:30:08.673161
25	69	motorbike	43H-1025	\N	approved	offline	2025-10-28 06:30:08.673161	2025-10-28 06:30:08.673161
28	87	motorbike	43A1-123.45	079203001234	approved	offline	2025-10-28 14:16:17.962012	2025-10-28 14:16:17.962012
\.


--
-- Data for Name: shop_profiles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.shop_profiles (id, user_id, shop_name, shop_address_id, description, open_hours, closed_hours, status, created_at, updated_at) FROM stdin;
1	1	Bún Chả Hà Nội	1	Bún chả chuẩn vị Hà Nội giữa lòng Đà Nẵng.	07:00	21:00	open	2025-10-28 06:07:55.357512	2025-10-28 06:07:55.357512
3	3	Bánh Xèo Bà Dưỡng	3	Quán bánh xèo trứ danh, giòn rụm và đậm đà.	08:00	22:00	open	2025-10-28 06:07:55.357512	2025-10-28 06:07:55.357512
4	4	Cơm Gà A Hải	4	Cơm gà Hội An – thơm ngon, giá hợp lý.	10:00	21:00	open	2025-10-28 06:07:55.357512	2025-10-28 06:07:55.357512
5	5	Bún Bò Huế O Lý	5	Bún bò Huế cay nồng, đậm đà vị miền Trung.	06:00	21:00	open	2025-10-28 06:07:55.357512	2025-10-28 06:07:55.357512
6	6	KFC Việt Nam - Đà Nẵng	6	Nhà hàng gà rán nổi tiếng toàn cầu – phục vụ nhanh, hương vị chuẩn KFC.	09:00	22:00	open	2025-10-28 06:07:55.357512	2025-10-28 06:07:55.357512
2	2	Mì Quảng Bà Mua	2	Mì Quảng trứ danh – đặc sản miền Trung.	06:30	21:30	open	2025-10-28 06:07:55.357512	2025-11-04 06:42:16.755405
31	95	Jollibee Phan Đăng Lưu	33	Thực đơn Jollibee đa dạng và phong phú, có rất nhiều sự lựa chọn cho bạn, gia đình và bạn bè.	09:30	21:30	open	2025-11-11 14:58:07.794321	2025-11-11 14:58:07.794321
\.


--
-- Data for Name: user_addresses; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_addresses (user_id, address_id, is_primary, created_at) FROM stdin;
1	1	t	2025-10-28 06:07:55.357512
2	2	t	2025-10-28 06:07:55.357512
3	3	t	2025-10-28 06:07:55.357512
4	4	t	2025-10-28 06:07:55.357512
5	5	t	2025-10-28 06:07:55.357512
6	6	t	2025-10-28 06:07:55.357512
45	20	t	2025-10-28 06:30:08.673161
47	22	t	2025-10-28 06:30:08.673161
49	24	t	2025-10-28 06:30:08.673161
51	26	t	2025-10-28 06:30:08.673161
53	28	t	2025-10-28 06:30:08.673161
87	30	t	2025-10-28 14:16:46.058955
88	31	t	2025-10-29 06:44:01.87678
95	33	t	2025-11-11 14:58:07.794321
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, username, password, email, phone, rating, full_name, avatar_url, role, status, created_at, updated_at) FROM stdin;
45	shop7	123456	shop7@example.com	0905888007	\N	Quán ăn 7	\N	shop	active	2025-10-28 06:30:08.673161	2025-10-28 06:30:08.673161
47	shop9	123456	shop9@example.com	0905888009	\N	Quán ăn 9	\N	shop	active	2025-10-28 06:30:08.673161	2025-10-28 06:30:08.673161
49	shop11	123456	shop11@example.com	0905888011	\N	Quán ăn 11	\N	shop	active	2025-10-28 06:30:08.673161	2025-10-28 06:30:08.673161
51	shop13	123456	shop13@example.com	0905888013	\N	Quán ăn 13	\N	shop	active	2025-10-28 06:30:08.673161	2025-10-28 06:30:08.673161
53	shop15	123456	shop15@example.com	0905888015	\N	Quán ăn 15	\N	shop	active	2025-10-28 06:30:08.673161	2025-10-28 06:30:08.673161
55	shipper11	123456	shipper11@example.com	0905777011	\N	Shipper số 11	\N	shipper	active	2025-10-28 06:30:08.673161	2025-10-28 06:30:08.673161
56	shipper12	123456	shipper12@example.com	0905777012	\N	Shipper số 12	\N	shipper	active	2025-10-28 06:30:08.673161	2025-10-28 06:30:08.673161
57	shipper13	123456	shipper13@example.com	0905777013	\N	Shipper số 13	\N	shipper	active	2025-10-28 06:30:08.673161	2025-10-28 06:30:08.673161
58	shipper14	123456	shipper14@example.com	0905777014	\N	Shipper số 14	\N	shipper	active	2025-10-28 06:30:08.673161	2025-10-28 06:30:08.673161
59	shipper15	123456	shipper15@example.com	0905777015	\N	Shipper số 15	\N	shipper	active	2025-10-28 06:30:08.673161	2025-10-28 06:30:08.673161
60	shipper16	123456	shipper16@example.com	0905777016	\N	Shipper số 16	\N	shipper	active	2025-10-28 06:30:08.673161	2025-10-28 06:30:08.673161
61	shipper17	123456	shipper17@example.com	0905777017	\N	Shipper số 17	\N	shipper	active	2025-10-28 06:30:08.673161	2025-10-28 06:30:08.673161
62	shipper18	123456	shipper18@example.com	0905777018	\N	Shipper số 18	\N	shipper	active	2025-10-28 06:30:08.673161	2025-10-28 06:30:08.673161
63	shipper19	123456	shipper19@example.com	0905777019	\N	Shipper số 19	\N	shipper	active	2025-10-28 06:30:08.673161	2025-10-28 06:30:08.673161
64	shipper20	123456	shipper20@example.com	0905777020	\N	Shipper số 20	\N	shipper	active	2025-10-28 06:30:08.673161	2025-10-28 06:30:08.673161
65	shipper21	123456	shipper21@example.com	0905777021	\N	Shipper số 21	\N	shipper	active	2025-10-28 06:30:08.673161	2025-10-28 06:30:08.673161
66	shipper22	123456	shipper22@example.com	0905777022	\N	Shipper số 22	\N	shipper	active	2025-10-28 06:30:08.673161	2025-10-28 06:30:08.673161
67	shipper23	123456	shipper23@example.com	0905777023	\N	Shipper số 23	\N	shipper	active	2025-10-28 06:30:08.673161	2025-10-28 06:30:08.673161
68	shipper24	123456	shipper24@example.com	0905777024	\N	Shipper số 24	\N	shipper	active	2025-10-28 06:30:08.673161	2025-10-28 06:30:08.673161
69	shipper25	123456	shipper25@example.com	0905777025	\N	Shipper số 25	\N	shipper	active	2025-10-28 06:30:08.673161	2025-10-28 06:30:08.673161
72	user23	123456	user23@example.com	0905666023	\N	Khách hàng số 23	\N	user	active	2025-10-28 06:30:08.673161	2025-10-28 06:30:08.673161
73	user24	123456	user24@example.com	0905666024	\N	Khách hàng số 24	\N	user	active	2025-10-28 06:30:08.673161	2025-10-28 06:30:08.673161
74	user25	123456	user25@example.com	0905666025	\N	Khách hàng số 25	\N	user	active	2025-10-28 06:30:08.673161	2025-10-28 06:30:08.673161
75	user26	123456	user26@example.com	0905666026	\N	Khách hàng số 26	\N	user	active	2025-10-28 06:30:08.673161	2025-10-28 06:30:08.673161
76	user27	123456	user27@example.com	0905666027	\N	Khách hàng số 27	\N	user	active	2025-10-28 06:30:08.673161	2025-10-28 06:30:08.673161
77	user28	123456	user28@example.com	0905666028	\N	Khách hàng số 28	\N	user	active	2025-10-28 06:30:08.673161	2025-10-28 06:30:08.673161
78	user29	123456	user29@example.com	0905666029	\N	Khách hàng số 29	\N	user	active	2025-10-28 06:30:08.673161	2025-10-28 06:30:08.673161
79	user30	123456	user30@example.com	0905666030	\N	Khách hàng số 30	\N	user	active	2025-10-28 06:30:08.673161	2025-10-28 06:30:08.673161
80	user31	123456	user31@example.com	0905666031	\N	Khách hàng số 31	\N	user	active	2025-10-28 06:30:08.673161	2025-10-28 06:30:08.673161
93	user05	123456	ncv.545@gmail.com	0778579293	\N	Nguyễn Chí Vương	\N	user	active	2025-11-06 19:04:45.912347	2025-11-06 19:04:45.912347
81	user32	123456	user32@example.com	0905666032	\N	Khách hàng số 32	\N	user	active	2025-10-28 06:30:08.673161	2025-10-28 06:30:08.673161
82	user33	123456	user33@example.com	0905666033	\N	Khách hàng số 33	\N	user	active	2025-10-28 06:30:08.673161	2025-10-28 06:30:08.673161
83	user34	123456	user34@example.com	0905666034	\N	Khách hàng số 34	\N	user	active	2025-10-28 06:30:08.673161	2025-10-28 06:30:08.673161
84	user35	123456	user35@example.com	0905666035	\N	Khách hàng số 35	\N	user	active	2025-10-28 06:30:08.673161	2025-10-28 06:30:08.673161
71	user22	123456	user22@example.com	0905666022	\N	Khách hàng số 22	\N	user	banned	2025-10-28 06:30:08.673161	2025-10-28 06:30:08.673161
70	user21	123456	user21@example.com	0905666021	\N	Khách hàng số 21	\N	user	active	2025-10-28 06:30:08.673161	2025-10-28 06:30:08.673161
87	shipper_vietnam	hashed_password_example	hohieudn2005@gmail.com	+84912345678	\N	Nguyễn Văn Tài	\N	shipper	active	2025-10-28 14:16:04.135069	2025-10-28 14:20:49.730596
4	comga_ahai	123456	ahai@example.com	0905000004	3.7	Cơm Gà A Hải	https://firebasestorage.googleapis.com/v0/b/fooddeli-6d394.firebasestorage.app/o/images%2Fuser_avatar%2FCom_Ga_A_Hai.webp?alt=media&token=35f6f536-d264-4733-91a9-a8eaeffb922e	shop	active	2025-10-28 06:07:55.357512	2025-10-28 06:23:00.095378
5	bunbo_oly	123456	oly@example.com	0905000005	1.2	Bún Bò Huế O Lý	https://firebasestorage.googleapis.com/v0/b/fooddeli-6d394.firebasestorage.app/o/images%2Fuser_avatar%2FQuan_Mon_Hue.webp?alt=media&token=7ddede93-479b-440b-b552-57db75da8431	shop	active	2025-10-28 06:07:55.357512	2025-10-28 06:23:00.095378
6	kfc_danang	123456	kfc.danang@example.com	0905123450	4.3	KFC Việt Nam - Đà Nẵng	https://firebasestorage.googleapis.com/v0/b/fooddeli-6d394.firebasestorage.app/o/images%2Fuser_avatar%2FKFC%20da%20nang.jpg?alt=media&token=8ef613c6-c90f-45ab-bf51-799d9edff41a	shop	active	2025-10-28 06:07:55.357512	2025-10-28 06:23:00.095378
88	kienjazz	password123	kienjazzmusic@gmail.com	0909090909	\N	Kien (Test User)	\N	shop	active	2025-10-28 14:23:44.139841	2025-10-28 14:23:44.139841
2	miquang_bamua	123456	bamua@example.com	+84935022537	1.7	Mì Quảng Bà Mua	https://firebasestorage.googleapis.com/v0/b/fooddeli-6d394.firebasestorage.app/o/images%2Fuser_avatar%2FMi_Quang_Ba_Mua.webp?alt=media&token=97c7e7e4-4635-40c5-9d94-4c9af169cf49	shop	active	2025-10-28 06:07:55.357512	2025-11-04 06:42:16.618956
3	banhxeo_baduong	123456	nguyenchivuong.73@gmail.com	+84935022521	2.4	Bánh Xèo Bà Dưỡng	https://firebasestorage.googleapis.com/v0/b/fooddeli-6d394.firebasestorage.app/o/images%2Fuser_avatar%2FBanh_Xeo_Ba_Duong.webp?alt=media&token=dd291509-b50d-4541-9f01-40a3ab092853	shop	active	2025-10-28 06:07:55.357512	2025-10-28 13:41:40.319014
95	jollibee_PDL	123456	jollibee_PDL@example.com	0987654321	4.5	Jollibee Phan Đăng Lưu	https://firebasestorage.googleapis.com/v0/b/fooddeli-6d394.firebasestorage.app/o/images%2Fuser_avatar%2FJollibee.png?alt=media&token=7dd99c60-23c4-48f0-993c-f1968b036ba7	shop	active	2025-11-11 14:58:07.794321	2025-11-11 14:58:07.794321
1	buncha_hn	123456	buncha_hn@gmail.com	0905000001	0.6	Bún Chả Hà Nội	https://firebasestorage.googleapis.com/v0/b/fooddeli-6d394.firebasestorage.app/o/images%2Fuser_avatar%2FAm_Thuc_Ha_Noi.webp?alt=media&token=8f12caed-5f90-4501-b0f8-6c1f691d7fd1	shop	active	2025-10-28 06:07:55.357512	2025-10-28 14:20:42.473866
89	trancong25112004	$2b$10$FOfTceGXYVVVioRr624mOeLIYOt5MB.lgKVJI99K6UCtlMBltZFdm	trancong25112004@gmail.com	+84913131313	\N	Công Trần	\N	user	active	2025-11-04 06:17:21.936853	2025-11-04 07:35:31.244843
\.


--
-- Data for Name: video_comments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.video_comments (comment_id, video_id, user_id, content, created_at) FROM stdin;
\.


--
-- Data for Name: video_likes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.video_likes (video_id, user_id, created_at) FROM stdin;
6	1	2025-10-28 07:05:38.881622
5	1	2025-10-28 13:28:55.501344
8	3	2025-11-12 07:12:20.231286
11	3	2025-11-12 07:12:26.886987
1	87	2025-11-04 07:09:19.027595
3	87	2025-11-04 07:09:25.318724
\.


--
-- Data for Name: videos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.videos (video_id, shop_id, title, description, video_url, duration, views_count, likes_count, comments_count, status, created_at, updated_at) FROM stdin;
5	5	Bún Bò Huế O Lý | Đậm đà hương vị miền Trung	Khám phá tô bún bò cay nồng, nước lèo nghi ngút khói cùng chả và giò heo đậm vị Huế tại O Lý.	https://firebasestorage.googleapis.com/v0/b/fooddeli-6d394.firebasestorage.app/o/videos%2Fshop_video%2Fbunbo.mp4?alt=media&token=fcdcaac6-ac86-4f34-981c-0aea7b3f03a8	50	9700	412	61	approved	2025-10-28 06:07:55.357512	2025-10-28 06:07:55.357512
7	2	asda	sd	https://firebasestorage.googleapis.com/v0/b/fooddeli-6d394.firebasestorage.app/o/videos%2Fshop_video%2Fa21b1561-7f14-4736-ba80-6728d7e10cb1_comga2.mp4?alt=media&token=a288454e-5ed8-407d-8282-bf76eb396300	79	0	0	0	approved	2025-11-04 06:29:13.138531	2025-11-04 06:29:13.138531
8	31	Jollibee Phan Đăng Lưu	Cả team chăm chỉ xoắn Mỳ Ý Jolly, nhiều thịt, đậm phô mai	https://firebasestorage.googleapis.com/v0/b/fooddeli-6d394.firebasestorage.app/o/videos%2Fshop_video%2Fjollibee.mp4?alt=media&token=f90475d6-3d15-4180-9b3b-d849664bb262	120	1500	51	10	approved	2025-11-11 16:06:39.603728	2025-11-11 16:06:39.603728
11	2	test	test 123	https://firebasestorage.googleapis.com/v0/b/fooddeli-6d394.firebasestorage.app/o/videos%2Fshop_video%2Fd0edb567-07e8-472f-9eeb-f64511cafcfb_comga2.mp4?alt=media&token=fe97c2a2-8108-4a15-a675-cef8c1fdb353	0	0	1	0	approved	2025-11-05 14:55:40.178237	2025-11-05 14:55:40.178237
6	6	KFC Việt Nam - Đà Nẵng | Gà rán giòn tan, vị ngon khó cưỡng 🍗🔥	Video quảng cáo chính thức của KFC Việt Nam, ghi lại không khí sôi động tại cửa hàng Đà Nẵng cùng món gà rán trứ danh.	https://firebasestorage.googleapis.com/v0/b/fooddeli-6d394.firebasestorage.app/o/videos%2Fshop_video%2Fkfc.mp4?alt=media&token=01f6f217-0a73-4d79-b679-705781380456	45	15800	921	102	approved	2025-10-28 06:07:55.357512	2025-10-28 06:07:55.357512
4	4	Cơm Gà A Hải | Vị Hội An giữa trung tâm Đà Nẵng	Khám phá món cơm gà chuẩn vị Hội An, với gà xé, hành phi, rau răm và nước mắm cay nồng đặc trưng của A Hải.	https://firebasestorage.googleapis.com/v0/b/fooddeli-6d394.firebasestorage.app/o/videos%2Fshop_video%2Fcomga.mp4?alt=media&token=2dcedac7-b625-4858-acbd-8e2d21754a74	39	7600	310	44	approved	2025-10-28 06:07:55.357512	2025-10-28 06:07:55.357512
2	2	Mì Quảng Bà Mua | Tinh hoa ẩm thực miền Trung	Video ghi lại quy trình nấu mì quảng gà chuẩn vị miền Trung, cùng không gian đậm chất quê hương tại Bà Mua – Đà Nẵng.	https://firebasestorage.googleapis.com/v0/b/fooddeli-6d394.firebasestorage.app/o/videos%2Fshop_video%2Fmyquangbamua.mp4?alt=media&token=78f8b01d-91a7-4e34-811b-305899296ce4	55	8800	460	72	approved	2025-10-28 06:07:55.357512	2025-10-28 06:07:55.357512
3	3	Bánh Xèo Bà Dưỡng | Giòn rụm từng miếng bánh	Video review ẩm thực nổi tiếng Đà Nẵng: bánh xèo giòn tan, nước chấm đậm đà và ram cuốn cải thơm lừng.	https://firebasestorage.googleapis.com/v0/b/fooddeli-6d394.firebasestorage.app/o/videos%2Fshop_video%2Fbanhxeobaduong.mp4?alt=media&token=b7d24f95-4949-4107-b9dc-9db371664a90	48	13200	682	95	approved	2025-10-28 06:07:55.357512	2025-11-06 07:40:17.82885
1	1	Bún Chả Hà Nội | Hương vị Bắc giữa lòng Đà Nẵng	Trải nghiệm món bún chả truyền thống với thịt nướng thơm lừng, nước chấm đậm đà và không khí thân quen tại Đà Nẵng.	https://firebasestorage.googleapis.com/v0/b/fooddeli-6d394.firebasestorage.app/o/videos%2Fshop_video%2Fbuncha.mp4?alt=media&token=4a5dc961-72d1-445a-b014-53c099297ed6	42	5200	242	35	approved	2025-10-28 06:07:55.357512	2025-10-28 06:07:55.357512
\.


--
-- Data for Name: vouchers; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.vouchers (voucher_id, code, type, discount_value, start_date, end_date, min_order_value, max_discount, status) FROM stdin;
2	FREESHIP30K	shipping	30000.00	2025-01-01	2025-12-31	100000.00	30000.00	active
3	FOOD20PCT	order	20000.00	2025-01-01	2025-09-30	150000.00	50000.00	active
4	NEWUSER50K	order	50000.00	2025-01-01	2025-12-31	0.00	50000.00	active
5	WEEKEND15K	order	15000.00	2025-01-01	2025-12-31	80000.00	15000.00	active
6	FREESHIP200	shipping	40000.00	2025-01-01	2025-12-31	200000.00	40000.00	active
\.


--
-- Name: addresses_address_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.addresses_address_id_seq', 33, true);


--
-- Name: cart_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.cart_items_id_seq', 75, true);


--
-- Name: carts_cart_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.carts_cart_id_seq', 7, true);


--
-- Name: categories_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.categories_category_id_seq', 4, true);


--
-- Name: contracts_contract_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.contracts_contract_id_seq', 1, false);


--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.notifications_id_seq', 1, false);


--
-- Name: order_details_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.order_details_id_seq', 101, true);


--
-- Name: orders_order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.orders_order_id_seq', 966, true);


--
-- Name: payments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.payments_id_seq', 1, false);


--
-- Name: product_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.product_category_id_seq', 14, true);


--
-- Name: products_product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.products_product_id_seq', 92, true);


--
-- Name: reviews_review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.reviews_review_id_seq', 1, false);


--
-- Name: shipper_profiles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.shipper_profiles_id_seq', 29, true);


--
-- Name: shop_profiles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.shop_profiles_id_seq', 31, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 95, true);


--
-- Name: video_comments_comment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.video_comments_comment_id_seq', 1, false);


--
-- Name: videos_video_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.videos_video_id_seq', 11, true);


--
-- Name: vouchers_voucher_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.vouchers_voucher_id_seq', 6, true);


--
-- Name: addresses addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT addresses_pkey PRIMARY KEY (address_id);


--
-- Name: cart_items cart_items_cart_id_shop_id_product_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_cart_id_shop_id_product_id_key UNIQUE (cart_id, shop_id, product_id);


--
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (id);


--
-- Name: carts carts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_pkey PRIMARY KEY (cart_id);


--
-- Name: carts carts_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_user_id_key UNIQUE (user_id);


--
-- Name: categories categories_category_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_category_name_key UNIQUE (category_name);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (category_id);


--
-- Name: contracts contracts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contracts
    ADD CONSTRAINT contracts_pkey PRIMARY KEY (contract_id);


--
-- Name: follows follows_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.follows
    ADD CONSTRAINT follows_pkey PRIMARY KEY (follower_id, followed_id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: order_details order_details_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_details
    ADD CONSTRAINT order_details_pkey PRIMARY KEY (id);


--
-- Name: order_vouchers order_vouchers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_vouchers
    ADD CONSTRAINT order_vouchers_pkey PRIMARY KEY (order_id, voucher_id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (order_id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: product_category product_category_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_category
    ADD CONSTRAINT product_category_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (product_id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (review_id);


--
-- Name: shipper_profiles shipper_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipper_profiles
    ADD CONSTRAINT shipper_profiles_pkey PRIMARY KEY (id);


--
-- Name: shipper_profiles shipper_profiles_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipper_profiles
    ADD CONSTRAINT shipper_profiles_user_id_key UNIQUE (user_id);


--
-- Name: shop_profiles shop_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shop_profiles
    ADD CONSTRAINT shop_profiles_pkey PRIMARY KEY (id);


--
-- Name: shop_profiles shop_profiles_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shop_profiles
    ADD CONSTRAINT shop_profiles_user_id_key UNIQUE (user_id);


--
-- Name: order_details unique_order_product; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_details
    ADD CONSTRAINT unique_order_product UNIQUE (order_id, product_id);


--
-- Name: user_addresses user_addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_addresses
    ADD CONSTRAINT user_addresses_pkey PRIMARY KEY (user_id, address_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: video_comments video_comments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.video_comments
    ADD CONSTRAINT video_comments_pkey PRIMARY KEY (comment_id);


--
-- Name: video_likes video_likes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.video_likes
    ADD CONSTRAINT video_likes_pkey PRIMARY KEY (video_id, user_id);


--
-- Name: videos videos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.videos
    ADD CONSTRAINT videos_pkey PRIMARY KEY (video_id);


--
-- Name: vouchers vouchers_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vouchers
    ADD CONSTRAINT vouchers_code_key UNIQUE (code);


--
-- Name: vouchers vouchers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vouchers
    ADD CONSTRAINT vouchers_pkey PRIMARY KEY (voucher_id);


--
-- Name: idx_reviews_reviewer; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_reviews_reviewer ON public.reviews USING btree (reviewer_id);


--
-- Name: idx_reviews_target; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_reviews_target ON public.reviews USING btree (target_type, target_id);


--
-- Name: idx_video_comments_video; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_video_comments_video ON public.video_comments USING btree (video_id);


--
-- Name: idx_video_likes_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_video_likes_user ON public.video_likes USING btree (user_id);


--
-- Name: idx_videos_shop; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_videos_shop ON public.videos USING btree (shop_id);


--
-- Name: unique_primary_address_per_user; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX unique_primary_address_per_user ON public.user_addresses USING btree (user_id) WHERE (is_primary = true);


--
-- Name: cart_items cart_items_cart_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_cart_id_fkey FOREIGN KEY (cart_id) REFERENCES public.carts(cart_id) ON DELETE CASCADE;


--
-- Name: cart_items cart_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(product_id) ON DELETE CASCADE;


--
-- Name: cart_items cart_items_shop_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_shop_id_fkey FOREIGN KEY (shop_id) REFERENCES public.shop_profiles(id) ON DELETE CASCADE;


--
-- Name: carts carts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: contracts contracts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contracts
    ADD CONSTRAINT contracts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: follows follows_followed_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.follows
    ADD CONSTRAINT follows_followed_id_fkey FOREIGN KEY (followed_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: follows follows_follower_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.follows
    ADD CONSTRAINT follows_follower_id_fkey FOREIGN KEY (follower_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: order_details order_details_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_details
    ADD CONSTRAINT order_details_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(order_id) ON DELETE CASCADE;


--
-- Name: order_details order_details_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_details
    ADD CONSTRAINT order_details_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(product_id) ON DELETE CASCADE;


--
-- Name: order_vouchers order_vouchers_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_vouchers
    ADD CONSTRAINT order_vouchers_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(order_id) ON DELETE CASCADE;


--
-- Name: order_vouchers order_vouchers_voucher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_vouchers
    ADD CONSTRAINT order_vouchers_voucher_id_fkey FOREIGN KEY (voucher_id) REFERENCES public.vouchers(voucher_id) ON DELETE CASCADE;


--
-- Name: orders orders_shipper_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_shipper_id_fkey FOREIGN KEY (shipper_id) REFERENCES public.shipper_profiles(id) ON DELETE SET NULL;


--
-- Name: orders orders_shop_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_shop_id_fkey FOREIGN KEY (shop_id) REFERENCES public.shop_profiles(id) ON DELETE CASCADE;


--
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: payments payments_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(order_id) ON DELETE CASCADE;


--
-- Name: product_category product_category_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_category
    ADD CONSTRAINT product_category_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(category_id);


--
-- Name: product_category product_category_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_category
    ADD CONSTRAINT product_category_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(product_id);


--
-- Name: products products_shop_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_shop_id_fkey FOREIGN KEY (shop_id) REFERENCES public.shop_profiles(id) ON DELETE CASCADE;


--
-- Name: reviews reviews_reviewer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_reviewer_id_fkey FOREIGN KEY (reviewer_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: reviews reviews_target_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_target_id_fkey FOREIGN KEY (target_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: shipper_profiles shipper_profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipper_profiles
    ADD CONSTRAINT shipper_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: shop_profiles shop_profiles_shop_address_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shop_profiles
    ADD CONSTRAINT shop_profiles_shop_address_id_fkey FOREIGN KEY (shop_address_id) REFERENCES public.addresses(address_id) ON DELETE SET NULL;


--
-- Name: shop_profiles shop_profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shop_profiles
    ADD CONSTRAINT shop_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_addresses user_addresses_address_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_addresses
    ADD CONSTRAINT user_addresses_address_id_fkey FOREIGN KEY (address_id) REFERENCES public.addresses(address_id) ON DELETE CASCADE;


--
-- Name: user_addresses user_addresses_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_addresses
    ADD CONSTRAINT user_addresses_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: video_comments video_comments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.video_comments
    ADD CONSTRAINT video_comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: video_comments video_comments_video_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.video_comments
    ADD CONSTRAINT video_comments_video_id_fkey FOREIGN KEY (video_id) REFERENCES public.videos(video_id) ON DELETE CASCADE;


--
-- Name: video_likes video_likes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.video_likes
    ADD CONSTRAINT video_likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: video_likes video_likes_video_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.video_likes
    ADD CONSTRAINT video_likes_video_id_fkey FOREIGN KEY (video_id) REFERENCES public.videos(video_id) ON DELETE CASCADE;


--
-- Name: videos videos_shop_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.videos
    ADD CONSTRAINT videos_shop_id_fkey FOREIGN KEY (shop_id) REFERENCES public.shop_profiles(id) ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: -
--

GRANT ALL ON SCHEMA public TO cloudsqlsuperuser;


--
-- PostgreSQL database dump complete
--

\unrestrict cb0LaCCquHA3a50m0NH61mAyp0rbUfvOfCV7neJ6JBa0rHukrfhPagftHZdQqch

