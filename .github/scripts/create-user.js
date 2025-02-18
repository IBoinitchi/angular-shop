import admin from "firebase-admin";
import fs from "fs";
import path from "path";

const serviceAccount = JSON.parse(`${process.env.SERVICE_ACCOUNT_KEY}`);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: serviceAccount?.database_url,
});

async function createUserIfNotExists(adminData) {
  try {
		const userRecord = await admin.auth().getUserByEmail(adminData.email).then(() => true).catch(() => false);
    if (userRecord) {
      console.log("User already exists.");
    } else {
      await createFirebaseAuthUser(adminData);
      console.log("User created successfully");
    }

    process.exit(0);
  } catch (error) {
    console.error("Error creating user:", error);
    process.exit(1);
  }
}

async function createFirebaseAuthUser(adminData) {
  try {		
    const userRecord = await admin.auth().createUser({
      email: adminData.email,
			displayName: adminData.name,
      password: adminData.password,
    });

		await admin.auth().setCustomUserClaims(userRecord.uid, { role: adminData.role, canBeDeleted: adminData.canBeDeleted });
    
		console.log(
      `User created in Authentication with email: ${userRecord.email}`
    );
    return userRecord;
  } catch (error) {
    console.error("Error creating Firebase Authentication user:", error);
  }
}

createUserIfNotExists(serviceAccount.admin_data);
