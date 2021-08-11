const { admin } = require("../../config/firebase-credentials");

async function signInFirebaseUser(email, password) {
  const user = await admin.auth().getUser(email);
  console.log(user);
}

module.exports.signInFirebaseUser = signInFirebaseUser;

this.signInFirebaseUser("postman@test.com", "12345678");
