CREATE TABLE IF NOT EXISTS peer_review_assignment (
  id SERIAL PRIMARY KEY,
  number INT,
  due TIMESTAMP,
  team_id INT REFERENCES teams(id)
);

CREATE TABLE IF NOT EXISTS peer_review_results (
  id SERIAL PRIMARY KEY,
  peer_review_assignment_id INT REFERENCES peer_review_assignment(id),
  reviewer_user_id INT REFERENCES users(id),
  reviewee_user_id INT REFERENCES users(id),
  responses JSON,
  completed_at TIMESTAMP DEFAULT NOW()
);
