--
-- PostgreSQL database dump
--

-- Dumped from database version 14.9
-- Dumped by pg_dump version 14.9

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: bookings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bookings (
    id bigint NOT NULL,
    "booking-date" date NOT NULL,
    "booking-time" time(6) without time zone NOT NULL,
    seats integer[] NOT NULL,
    status character varying(255) NOT NULL,
    "total-price" double precision NOT NULL,
    showtime_id bigint,
    user_id bigint,
    test integer,
    "movie-date" date,
    CONSTRAINT bookings_status_check CHECK (((status)::text = ANY ((ARRAY['PENDING'::character varying, 'CANCELLED'::character varying, 'PAID'::character varying])::text[])))
);


--
-- Name: bookings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.bookings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: bookings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.bookings_id_seq OWNED BY public.bookings.id;


--
-- Name: discount; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.discount (
    id character varying(255) NOT NULL,
    before_6pm real,
    tuesday_discount real,
    title character varying(255),
    percent_discount real,
    CONSTRAINT discount_percent_discount_check CHECK (((percent_discount >= (0)::double precision) AND (percent_discount <= (100)::double precision)))
);


--
-- Name: discount_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.discount_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: discount_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.discount_id_seq OWNED BY public.discount.id;


--
-- Name: locations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.locations (
    id bigint NOT NULL,
    city character varying(255) NOT NULL,
    state character varying(255) NOT NULL
);


--
-- Name: locations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.locations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: locations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.locations_id_seq OWNED BY public.locations.id;


--
-- Name: member; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.member (
    id bigint NOT NULL,
    membership_tier character varying(255) NOT NULL,
    reward_point integer NOT NULL,
    user_id bigint NOT NULL,
    stripe_customer_id character varying(255),
    subscription_id character varying(255),
    CONSTRAINT member_membership_tier_check CHECK (((membership_tier)::text = ANY ((ARRAY['Regular'::character varying, 'Premium'::character varying])::text[])))
);


--
-- Name: member_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.member_seq
    START WITH 1
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: movies; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.movies (
    id bigint NOT NULL,
    description character varying(255),
    duration numeric(21,0) NOT NULL,
    poster_url character varying(255) NOT NULL,
    release_date date NOT NULL,
    title character varying(255) NOT NULL
);


--
-- Name: movies_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.movies_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: movies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.movies_id_seq OWNED BY public.movies.id;


--
-- Name: screen; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.screen (
    id bigint NOT NULL,
    capacity integer,
    name character varying(255),
    location_id bigint NOT NULL
);


--
-- Name: screen_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.screen_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: screen_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.screen_id_seq OWNED BY public.screen.id;


--
-- Name: screen_movies; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.screen_movies (
    screen_id bigint NOT NULL,
    movies_id bigint NOT NULL
);


--
-- Name: screens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.screens (
    id bigint NOT NULL,
    capacity integer,
    name character varying(255),
    location_id bigint
);


--
-- Name: screens_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.screens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: screens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.screens_id_seq OWNED BY public.screens.id;


--
-- Name: screens_movies; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.screens_movies (
    screen_id bigint NOT NULL,
    movies_id bigint NOT NULL
);


--
-- Name: showtime; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.showtime (
    id bigint NOT NULL,
    available_seat integer[],
    date date,
    end_time time(6) without time zone,
    price double precision,
    start_time time(6) without time zone,
    movie_id bigint,
    screen_id bigint,
    discount_id character varying(255)
);


--
-- Name: showtime_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.showtime_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: showtime_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.showtime_id_seq OWNED BY public.showtime.id;


--
-- Name: user; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."user" (
    id bigint NOT NULL,
    email character varying(255) NOT NULL,
    first_name character varying(255) NOT NULL,
    last_name character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(255) NOT NULL,
    username character varying(255) NOT NULL,
    CONSTRAINT user_role_check CHECK (((role)::text = ANY ((ARRAY['Employee'::character varying, 'Member'::character varying])::text[])))
);


--
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;


--
-- Name: bookings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings ALTER COLUMN id SET DEFAULT nextval('public.bookings_id_seq'::regclass);


--
-- Name: discount id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.discount ALTER COLUMN id SET DEFAULT nextval('public.discount_id_seq'::regclass);


--
-- Name: locations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.locations ALTER COLUMN id SET DEFAULT nextval('public.locations_id_seq'::regclass);


--
-- Name: movies id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.movies ALTER COLUMN id SET DEFAULT nextval('public.movies_id_seq'::regclass);


--
-- Name: screen id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.screen ALTER COLUMN id SET DEFAULT nextval('public.screen_id_seq'::regclass);


--
-- Name: screens id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.screens ALTER COLUMN id SET DEFAULT nextval('public.screens_id_seq'::regclass);


--
-- Name: showtime id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.showtime ALTER COLUMN id SET DEFAULT nextval('public.showtime_id_seq'::regclass);


--
-- Name: user id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- Name: bookings bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_pkey PRIMARY KEY (id);


--
-- Name: discount discount_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.discount
    ADD CONSTRAINT discount_pkey PRIMARY KEY (id);


--
-- Name: locations locations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.locations
    ADD CONSTRAINT locations_pkey PRIMARY KEY (id);


--
-- Name: member member_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.member
    ADD CONSTRAINT member_pkey PRIMARY KEY (id);


--
-- Name: movies movies_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.movies
    ADD CONSTRAINT movies_pkey PRIMARY KEY (id);


--
-- Name: screen screen_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.screen
    ADD CONSTRAINT screen_pkey PRIMARY KEY (id);


--
-- Name: screens screens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.screens
    ADD CONSTRAINT screens_pkey PRIMARY KEY (id);


--
-- Name: showtime showtime_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.showtime
    ADD CONSTRAINT showtime_pkey PRIMARY KEY (id);


--
-- Name: member uk_a9bw6sk85ykh4bacjpu0ju5f6; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.member
    ADD CONSTRAINT uk_a9bw6sk85ykh4bacjpu0ju5f6 UNIQUE (user_id);


--
-- Name: bookings uk_figf0x7qk2dk68ew9qmbknka0; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT uk_figf0x7qk2dk68ew9qmbknka0 UNIQUE (user_id);


--
-- Name: user uk_ob8kqyqqgmefl0aco34akdtpe; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT uk_ob8kqyqqgmefl0aco34akdtpe UNIQUE (email);


--
-- Name: bookings uk_onhvvpwk7rww43u9nteedxkwe; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT uk_onhvvpwk7rww43u9nteedxkwe UNIQUE (showtime_id);


--
-- Name: user uk_sb8bbouer5wak8vyiiy4pf2bx; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT uk_sb8bbouer5wak8vyiiy4pf2bx UNIQUE (username);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: screen_movies FK6odv5g5c5dyd7ufjjx9c7brak; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.screen_movies
    ADD CONSTRAINT "FK6odv5g5c5dyd7ufjjx9c7brak" FOREIGN KEY (screen_id) REFERENCES public.screen(id);


--
-- Name: showtime FKa9utupelpumt55xmfj55cq0sr; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.showtime
    ADD CONSTRAINT "FKa9utupelpumt55xmfj55cq0sr" FOREIGN KEY (movie_id) REFERENCES public.movies(id);


--
-- Name: member FKak0vcal1n334vgrgeh7gu3eie; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.member
    ADD CONSTRAINT "FKak0vcal1n334vgrgeh7gu3eie" FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- Name: bookings FKb21s94u9hevh3v2ekevivj0mn; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT "FKb21s94u9hevh3v2ekevivj0mn" FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- Name: screen_movies FKhbmnxsqcdr23symytad7p6tsg; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.screen_movies
    ADD CONSTRAINT "FKhbmnxsqcdr23symytad7p6tsg" FOREIGN KEY (movies_id) REFERENCES public.movies(id);


--
-- Name: screens_movies FKhcofhj4wndts72jyp4rm08r4b; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.screens_movies
    ADD CONSTRAINT "FKhcofhj4wndts72jyp4rm08r4b" FOREIGN KEY (screen_id) REFERENCES public.screens(id);


--
-- Name: screens_movies FKhqci2kialdgkrcmgcedk7ogns; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.screens_movies
    ADD CONSTRAINT "FKhqci2kialdgkrcmgcedk7ogns" FOREIGN KEY (movies_id) REFERENCES public.movies(id);


--
-- Name: showtime FKi0g0ikjcxvbu1tua75fx96n4p; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.showtime
    ADD CONSTRAINT "FKi0g0ikjcxvbu1tua75fx96n4p" FOREIGN KEY (discount_id) REFERENCES public.discount(id);


--
-- Name: screens FKi3ltfuqkktu9qhqdgcukl4ol3; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.screens
    ADD CONSTRAINT "FKi3ltfuqkktu9qhqdgcukl4ol3" FOREIGN KEY (location_id) REFERENCES public.locations(id);


--
-- Name: showtime FKm6x40qhpovci3xa4vqi2ul5el; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.showtime
    ADD CONSTRAINT "FKm6x40qhpovci3xa4vqi2ul5el" FOREIGN KEY (screen_id) REFERENCES public.screen(id);


--
-- Name: bookings FKqwfhl5oafa9jw24ua5q8w4flu; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT "FKqwfhl5oafa9jw24ua5q8w4flu" FOREIGN KEY (showtime_id) REFERENCES public.showtime(id);


--
-- Name: screen FKs5arilyt0s7blaqfec3oyo099; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.screen
    ADD CONSTRAINT "FKs5arilyt0s7blaqfec3oyo099" FOREIGN KEY (location_id) REFERENCES public.locations(id);


--
-- PostgreSQL database dump complete
--

