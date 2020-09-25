// Requires
const https = require('https');
const { resolve } = require('path');

/** @function findOrCreateUser
 * Finds the user in the database with the specified eid,
 * or creates the user if they do not exist
 * @param {Database} db - the database to add the user to
 * @param {string} eid - the user's K-State eid 
 * @returns {Promise} resolves to a user object
 */
async function findOrCreateUser(db, eid) {
    console.log("In Find Or Create User", eid);
    var user = await findUser(db, eid);
    console.log('1', user);
    if(!user) user = await createUser(db, eid);
    console.log('2', user);
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
    return new Promise((resolve, reject) => {
        // Request user directory information from K-State SOAP service
        var url = `https://www.k-state.edu/People/filter/eid=${eid}`;
        https.get(url, (response) => {
            var body = "";
            // The request body will come in chunks; we
            // must collect it
            response.on('data', (chunk) => {
                body += chunk;
            });
            // Once it's collected, we get the user's info
            response.on('end', () => {
                var first = /<fn>(\S+)<\/fn>/.exec(body)[1];
                var last = /<ln>(\S+)<\/ln>/.exec(body)[1];
                console.log('first', first, 'last', last);
                db.users.save({
                    eid: eid,
                    first: first,
                    last: last
                }).then(user => {
                    console.log("ONCE MORE USER:", user);
                    resolve(user)
                }).catch(err => console.error(err));
            });
            // If there is an error processing the body, reject
            response.on('error', reject);
        });
    });
}

module.exports = {
    findUser,
    createUser,
    findOrCreateUser
}