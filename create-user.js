const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

const serviceAccount = JSON.parse(`${process.env.SERVICE_ACCOUNT_KEY}`);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: serviceAccount?.database_url,
});

const db = admin.database();
const adminData = serviceAccount.admin_data;

async function createUserIfNotExists(admin) {
  try {
    const ref = db.ref("users");
    const snapshot = await ref
      .orderByChild("email")
      .equalTo(admin.email)
      .once("value");

    if (snapshot.exists()) {
      console.log("User already exists.");
    } else {
      const createdUser = await createFirebaseAuthUser(
        admin.email,
        admin.password
      );

      const newUserRef = db.ref(`/users/${createdUser.uid}`);
      await newUserRef.set({
        email: admin.email,
        name: admin.name,
        role: admin.role,
        canBeDeleted: admin.canBeDeleted,
      });

      console.log("User created successfully");
    }
    process.exit(0);
  } catch (error) {
    console.error("Error creating user:", error);
    process.exit(1);
  }
}

async function createFirebaseAuthUser(email, password) {
  try {
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
    });
    console.log(
      `User created in Authentication with email: ${userRecord.email}`
    );
    return userRecord;
  } catch (error) {
    console.error("Error creating Firebase Authentication user:", error);
    throw error;
  }
}

createUserIfNotExists(adminData);
