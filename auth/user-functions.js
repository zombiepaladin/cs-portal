// Requires
const { resolve } = require('path');
const axios = require('axios');

/** @function findOrCreateUser
 * Finds the user in the database with the specified eid,
 * or creates the user if they do not exist
 * @param {Database} db - the database to add the user to
 * @param {string} eid - the user's K-State eid
 * @returns {Promise} resolves to a user object
 */
async function findOrCreateUser(db, eid) {
    var user = await findUser(db, eid);
    if(!user) user = await createUser(db, eid);
    return user;
}

/** @function findUser
 * Finds the user in the database with the specified eid
 * @param {Database} db - the database to add the user to
 * @param {string} eid - the user's K-State eid
 * @returns {Promise} resolves to a user object
 */
async function findUser(db, eid) {
    var user = await db.users.findOne({eid: eid});
    return user;
}

/** @function createUser
 * Creates a user entry in the database for the supplied eid,
 * Adding directory information from the K-State SOAP service
 * @param {Database} db - the database to add the user to
 * @param {string} eid - the user's K-State eid
 * @returns {Promise} resolves to a user object
 */
async function createUser(db, eid) {
  // Get the user's directory information
  var url = `https://www.k-state.edu/People/filter/eid=${eid}`;
  var response = await axios.get(url);
  // Extract the user's first and last names from it
  var first = /<fn>(\S+)<\/fn>/.exec(response.data)[1];
  var last = /<ln>(\S+)<\/ln>/.exec(response.data)[1];
  // Insert the user into the database, and return them
  return await db.users.insert({
      eid: eid,
      first: first,
      last: last
  });
}

module.exports = {
    findUser,
    createUser,
    findOrCreateUser
}
