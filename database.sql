CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE DATABASE "user-auth";

CREATE TABLE users (
	id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
	username TEXT NOT NULL,
	email TEXT NOT NULL UNIQUE,
	password TEXT NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE favorites (
	id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
	user_id uuid NOT NULL,
	movie_id TEXT NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

-- psql -U postgres
-- \c "user-auth"
-- \i "database.sql"
-- \dt -- list tables