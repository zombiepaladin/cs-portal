SELECT 
    AVG((responses ->> 'q0')::real) AS "Participates in group discussion",
    AVG((responses ->> 'q1')::real) AS "Helped keep group focused and on-task",
    AVG((responses ->> 'q2')::real) AS "Contributed useful ideas",
    AVG((responses ->> 'q2')::real) AS "Quality of work done",
    AVG((responses ->> 'q3')::real) AS "Quantity of work done",
    AVG((responses ->> 'q4')::real) AS "Effectiveness communicating",
    ARRAY_AGG(responses ->> 'shareWithPeer') AS "Peer comments"
FROM peer_review_results 
WHERE reviewee_user_id = $1
GROUP BY peer_review_assignment_id;