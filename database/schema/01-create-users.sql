CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  eid UNIQUE TEXT,
  first TEXT,
  last TEXT
);