"use strict";

import {initializeApp} from "firebase-admin/app";
import {getAuth, UserRecord} from "firebase-admin/auth";
import {
  onCall,
  HttpsError,
  CallableRequest,
} from "firebase-functions/v2/https";

initializeApp();

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailRegex.test(email);
};

const validateRole = (role: string): boolean => {
  const validRoles = ["SUPER_ADMIN", "ADMIN", "MODERATOR"];
  return validRoles.includes(role);
};

const validateRequest = (
  request: CallableRequest<any>,
  requiredRole: string[] = ["SUPER_ADMIN"]
): void => {
  if (!request.auth) {
    throw new HttpsError(
      "unauthenticated",
      "The user requires authentication."
    );
  }

  if (!requiredRole.includes(request.auth.token?.role)) {
    throw new HttpsError(
      "permission-denied",
      "The user role does not allow editing this area."
    );
  }
};

const handleError = (error: any, message: string): never => {
  console.error(message, error);
  throw new HttpsError("internal", `${message}: ${error.message}`);
};

export const createUser = onCall(async (request: CallableRequest<any>) => {
  validateRequest(request);

  const {role, email, name, password} = request.data as {
    role: string;
    email?: string;
    name?: string;
    password?: string;
  };

  if (!role) {
    throw new HttpsError("invalid-argument", "You must provide role.");
  }

  if (!validateRole(role)) {
    throw new HttpsError("invalid-argument", "Invalid role provided.");
  }

  if (email && !validateEmail(email)) {
    throw new HttpsError("invalid-argument", "Invalid email address.");
  }

  const userData: Partial<{
    email: string;
    displayName: string;
    password: string;
  }> = {};

  if (email) userData.email = email;
  if (name) userData.displayName = name;
  if (password) userData.password = password;

  try {
    const userRecord = await getAuth().createUser(userData);
    await getAuth().setCustomUserClaims(userRecord.uid, {
      role,
      canBeDeleted: true,
    });
    return {message: `Create new user with ID: ${userRecord.uid}`};
  } catch (error: any) {
    return handleError(error, "Error creating user");
  }
});

export const updateUser = onCall(async (request: CallableRequest<any>) => {
  validateRequest(request);

  const {id, role, email, name, password} = request.data as {
    id: string;
    role: string;
    email?: string;
    name?: string;
    password?: string;
  };

  if (!id || !role) {
    throw new HttpsError("invalid-argument", "You must provide UID and role.");
  }

  if (!validateRole(role)) {
    throw new HttpsError("invalid-argument", "Invalid role provided.");
  }

  if (email && !validateEmail(email)) {
    throw new HttpsError("invalid-argument", "Invalid email address.");
  }

  const userData: Partial<{
    email: string;
    displayName: string;
    password: string;
    canBeDeleted: boolean;
  }> = {};

  if (email) userData.email = email;
  if (name) userData.displayName = name;
  if (password) userData.password = password;

  try {
    await getAuth().updateUser(id, userData);
    await getAuth().setCustomUserClaims(id, {role});
    return {message: `Information updated for user with ID: ${id}`};
  } catch (error: any) {
    return handleError(error, "Error updating user data");
  }
});

export const getAllUsers = onCall(async (request: CallableRequest<any>) => {
  validateRequest(request, ["SUPER_ADMIN", "ADMIN"]);

  try {
    const result = await getAuth().listUsers(1000);
    const users = result.users.map((user: UserRecord) => {
      let canBeDeleted = true;

      if (user.customClaims?.canBeDeleted !== undefined) {
        canBeDeleted = user.customClaims?.canBeDeleted;
      }

      return {
        id: user.uid,
        email: user.email,
        name: user.displayName || null,
        role: user.customClaims?.role || null,
        canBeDeleted,
      };
    });
    return users;
  } catch (error: any) {
    return handleError(error, "Error fetching users");
  }
});

export const getUser = onCall(async (request: CallableRequest<any>) => {
  validateRequest(request);

  const {id} = request.data as { id: string };

  if (!id) {
    throw new HttpsError("invalid-argument", "You must provide UID.");
  }

  try {
    const user = await getAuth().getUser(id);

    let canBeDeleted = true;

    if (user.customClaims?.canBeDeleted !== undefined) {
      canBeDeleted = user.customClaims?.canBeDeleted;
    }

    return {
      id: user.uid,
      email: user.email,
      name: user.displayName || null,
      role: user.customClaims?.role || "MODERATOR",
      canBeDeleted: canBeDeleted,
    };
  } catch (error: any) {
    return handleError(error, "Error fetching user");
  }
});

export const deleteUser = onCall(async (request: CallableRequest<any>) => {
  validateRequest(request);

  const {id} = request.data as { id: string };

  if (!id) {
    throw new HttpsError("invalid-argument", "You must provide UID.");
  }

  try {
    await getAuth().deleteUser(id);
    return {message: `User with ID: ${id} deleted successfully`};
  } catch (error: any) {
    return handleError(error, "Error deleting user");
  }
});
