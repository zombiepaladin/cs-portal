CREATE TABLE IF NOT EXISTS teams_users (
  team_id INTEGER REFERENCES teams(id),
  user_id INTEGER REFERENCES users(id)
);
CREATE UNIQUE INDEX teams_users_idx ON teams_users(team_id, user_id);