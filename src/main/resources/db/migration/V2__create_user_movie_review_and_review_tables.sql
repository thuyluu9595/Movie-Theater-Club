-- Create reviews table
CREATE TABLE reviews (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255),
    rating REAL,
    comment TEXT,
    created_at TIMESTAMP
);

-- Create user_movie_reviews table
CREATE TABLE user_movie_reviews (
    id BIGSERIAL PRIMARY KEY,
    review_id BIGINT,
    user_id BIGINT,
    movie_id BIGINT,
    CONSTRAINT fk_review FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE,
    CONSTRAINT fk_movie FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
    CONSTRAINT uc_user_movie UNIQUE (user_id, movie_id)
);