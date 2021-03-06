require("dotenv").config();
const admin = require("firebase-admin");

const cred = {
  type: "service_account",
  project_id: "todoapp-68338",
  private_key_id: process.env.private_key_id,
  private_key: process.env.private_key.replace(/\\n/g, "\n"),
  client_email: "firebase-adminsdk-qbov8@todoapp-68338.iam.gserviceaccount.com",
  client_id: "106592824360340477460",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-qbov8%40todoapp-68338.iam.gserviceaccount.com",
};

admin.initializeApp({ credentials: admin.credential.cert(cred), projectId: "todoapp-68338" });
console.log("Firebase initialized");
module.exports.admin = admin;
