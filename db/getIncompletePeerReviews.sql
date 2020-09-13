SELECT DISTINCT CONCAT(users.first, ' ', users.last) AS name, users.id AS uid, peer_review_assignment.id AS aid, teams.name AS team, due
FROM users
LEFT JOIN teams_users ON users.id = teams_users.user_id
LEFT JOIN teams ON teams_users.team_id = teams.id
LEFT JOIN peer_review_assignment ON peer_review_assignment.team_id = teams.id
WHERE peer_review_assignment.team_id IN (
  SELECT teams.id
  FROM teams
  INNER JOIN teams_users ON teams.id = teams_users.team_id
  WHERE teams_users.user_id = $1
) AND users.id NOT IN (
  SELECT reviewee_user_id
  FROM peer_review_results
  WHERE peer_review_assignment_id = peer_review_assignment.id
);
