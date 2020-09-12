function todo(req, res) {
  var eid = req.session.user.eid;
  var db = req.app.get('db');
  db.getIncompletePeerReviews(req.session.user.id).then(reviews => {
    res.send(render(reviews));
  }).catch(err => {
    console.log(err);
    res.send("ERROR");
  });
}

module.exports = todo;

function render(reviews){
  const links = reviews.map((review) => {
    return `
      <li>
         <a href="/peer-reviews/complete?name=${review.name}&aid=${review.aid}&uid=${review.uid}">
          ${review.name} [${review.team}]
        </a>
      </li>
    `
  }).join('');
  return `<!doctype html>
          <html>
            <head>
              <title>Peer Reviews</title>
            </head>
            <body>
              <h1>Peer Reviews to Complete</h1>
              <p><i>Complete any peer reviews listed below (including for yourself)</i></p>
              <ul>${links}</ul>
            </body>
          </html>
  `;
}
