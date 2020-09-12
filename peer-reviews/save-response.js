const qs = require('querystring');

function saveResponse(req, res) {
  var chunks = [];

  req.on('error', err => {
    console.error(err);
    res.statusCode = 500;
    res.end();
  });

  req.on('data', data => {
    chunks.push(data);
  });

  req.on('end', () => {
    var data = qs.parse(chunks.join(''));
    var aid = req.query.aid;
    var uid = req.query.uid;
    var db = req.app.get('db');
    db.peer_review_results.save({
      peer_review_assignment_id: aid,
      reviewer_user_id: req.session.user.id,
      reviewee_user_id: uid,
      responses: JSON.stringify(data),
    }).then(() => res.redirect('/peer-reviews/todo'))
    .catch(err => {
      console.error(err);
      res.statusCode = 500;
      res.end();
    });
  });
}

module.exports = saveResponse;
