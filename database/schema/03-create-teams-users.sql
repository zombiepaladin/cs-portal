CREATE TABLE IF NOT EXISTS teams_users (
  team_id REFERENCES teams(id),
  user_id REFERENCES users(id)
);
