const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// ✅ Config Firestore để ignore undefined properties
const db = admin.firestore();
db.settings({ 
  ignoreUndefinedProperties: true 
});

console.log("✅ Firestore configured with ignoreUndefinedProperties: true");

module.exports = admin;

