SELECT 
    CONCAT(users.first, ' ', users.last) AS name,
    AVG((responses ->> 'q0')::real) AS "Participates in group discussion",
    AVG((responses ->> 'q1')::real) AS "Helped keep group focused and on-task",
    AVG((responses ->> 'q2')::real) AS "Contributed useful ideas",
    AVG((responses ->> 'q3')::real) AS "Quality of work done",
    AVG((responses ->> 'q4')::real) AS "Quantity of work done",
    AVG((responses ->> 'q0')::real) AS "Effectiveness communicating",
    ARRAY_AGG(responses ->> 'shareWithPeer') AS "Peer comments",
    ARRAY_AGG(responses ->> 'shareWithInstructor') AS "Instructor comments"
FROM peer_review_results 
INNER JOIN users ON users.id = peer_review_results.reviewee_user_id
GROUP BY name, peer_review_assignment_id;



SELECT 
    CONCAT(users.first, ' ', users.last) as NAME, 
    COUNT(reviewer_user_id) AS complete,
    (
        SELECT COUNT(teams_users.user_id)
        FROM teams_users INNER JOIN peer_review_assignment on peer_review_assignment.team_id = teams_users.team_id
        WHERE peer_review_assignment.id = peer_review_results.peer_review_assignment_id
    ) as assigned
FROM peer_review_results 
    INNER JOIN users on reviewee_user_id = users.id
GROUP BY peer_review_results.peer_review_assignment_id, name;



SELECT 
    teams.name AS team
    CONCAT(users.first, ' ', users.last) as name, 
    COUNT(reviewer_user_id) AS complete
FROM peer_review_results 
    INNER JOIN users on reviewee_user_id = users.id
    INNER JOIN teams_users on teams_users.users_id = reviewer_user_id
    INNER JOIN teams on teams.id = teams_users.team_id
GROUP BY team, name
ORDER BY team, name;
