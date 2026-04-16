-- Create vector extension
CREATE EXTENSION IF NOT EXISTS vector;
-- Add embedding col for store genres vector in movies table
ALTER TABLE movies ADD COLUMN embedding VECTOR(1536);