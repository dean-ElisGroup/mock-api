import admin from "firebase-admin";
import serviceAccount from "./firebase-service-account.json" assert { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: ""https://elis-solservices-dev-default-rtdb.europe-west1.firebasedatabase.app" // replace with yours
});

const db = admin.database();

export default db;
