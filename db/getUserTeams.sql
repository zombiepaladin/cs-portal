SELECT teams.id, teams.name
FROM teams
INNER JOIN teams_users ON teams.id = teams_users.team_id
WHERE teams_users.user_id = $1;
