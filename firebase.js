const admin = require("firebase-admin");

const serviceAccount = JSON.parse(
  Buffer.from(process.env.FIREBASE_CREDENTIALS, 'base64').toString('utf8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://elis-solservices-dev-default-rtdb.europe-west1.firebasedatabase.app/" // Replace with your actual URL
});

const db = admin.database();

module.exports = db;
