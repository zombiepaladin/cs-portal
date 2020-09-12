function entryForm(req, res) {
  var name = req.query.name;
  var aid = req.query.aid;
  var uid = req.query.uid;
  res.send(render(name, aid, uid));
}

module.exports = entryForm;

function render(name, aid, uid) {
  const questions = [
    "Participates in group discussion",
    "Helped keep group focused and on-task",
    "Contributed useful ideas",
    "Quality of work done",
    "Quantity of work done",
    "Effectiveness communicating"
  ].map((question, index) => {
    return renderScaleQuestion(index, question);
  }).join('');
  return `<!doctype html>
          <html>
            <head>
              <title>Peer Review Form</title>
              <style>
                textarea {
                  width: 100%;
                }
                form {
                  max-width: 500px;
                }
              </style>
            </head>
            <body>
              <h1>Peer Review for ${name}</h1>
              <form method="POST">
                <label><i>Rate your teamate on:</label>
                ${questions}
                <fieldset>
                  <label>Is there any advice you would like to offer your teammate?</label><br/>
                  <textarea name="shareWithPeer"></textarea>
                </fieldset>
                <fieldset>
                  <label>Is there any information you would like to share about your teammate to the instructor?</label><br/>
                  <textarea name="shareWithInstructor"></textarea>
                </fieldset>
                <fieldset>
                  <input type="submit" value="Save"/>
                </fieldset>
              </form>
            </body>
          </html>
  `;
}

function renderScaleQuestion(id, question){
  const values = [10,9,8,7,6,5,4,3,2,1,0].map(n => `<label>${n}<input type="radio" name="q${id}" value="${n}" required/></label>`).join('');
  return `
    <fieldset class="scale">
      <label class="question">${question}</label><br/>
      High - ${values} - Low
    </fieldset>
  `;
}
