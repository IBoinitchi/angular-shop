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

const user = {
  email: adminData.email,
  name: adminData.name,
  role: adminData.role,
  canBeDeleted: adminData.canBeDeleted,
};

async function createUserIfNotExists(user) {
  try {
    const ref = db.ref("users");
    const snapshot = await ref
      .orderByChild("email")
      .equalTo(user.email)
      .once("value");

    if (snapshot.exists()) {
      console.log("User already exists.");
    } else {
      const createdUser = await createFirebaseAuthUser(
        adminData.email,
        adminData.password
      );

      const newUserRef = db.ref(`/users/${createdUser.uid}`);
      await newUserRef.set(user);

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

createUserIfNotExists(user);
