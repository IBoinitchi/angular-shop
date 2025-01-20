import { Injectable, inject } from "@angular/core";
import {
  Database,
  ref,
  get,
  orderByChild,
  equalTo,
  query,
  set,
} from "@angular/fire/database";
import { Role, User } from "../models/interfaces";

@Injectable({
  providedIn: "root",
})
export class RoleService {
  private db = inject(Database);
  private tableName = "users";

  async getUsersRoles(): Promise<User[]> {
    try {
      const snapshot = await get(ref(this.db, this.tableName));

      if (!snapshot.exists()) {
        console.log("No users found");
        return null;
      }

      const snapshotUsersRoles = snapshot.val();
      const usersRoles: User[] = Object.keys(snapshotUsersRoles).map((key) => ({
        ...snapshotUsersRoles[key],
        idKey: key,
      }));

      return usersRoles;
    } catch (error) {
      console.error("Error fetching data: ", error);
      return null;
    }
  }

  async getRoleByUserId(userIdKey: string) {
    try {
      const snapshot = await get(
        ref(this.db, `/${this.tableName}/${userIdKey}`)
      );

      if (!snapshot.exists()) {
        console.log("No user found");
        return null;
      }

      const snapshotValues = snapshot.val();

      return {
        ...snapshotValues,
        idKey: userIdKey,
      };
    } catch (error) {
      console.error("Error fetching data: ", error);
      return null;
    }
  }

  async findRoleUserByEmail(email: string) {
    try {
      const userData = query(
        ref(this.db, this.tableName),
        orderByChild("email"),
        equalTo(email)
      );

      const snapshot = await get(userData);

      if (!snapshot.exists()) {
        console.log("No user found");
        return null;
      }

      const snapshotValues = snapshot.val();
      const objectKey = Object.keys(snapshotValues)[0];
      const originalData = snapshotValues[objectKey];
      return {
        ...originalData,
        idKey: objectKey,
      };
    } catch (error) {
      console.error("Error fetching data: ", error);
      return null;
    }
  }

  async updateUser(userData) {
    console.log(userData);
    const userTableData = {
      email: userData.email,
      role: userData.role,
      name: userData.name,
      canBeDeleted: true,
    };

    if (userData.idKey) {
      set(ref(this.db, `/${this.tableName}/${userData.idKey}`), userTableData)
        .then(() => {
          return userTableData;
        })
        .catch((error) => {
          console.error("Error write data: ", error);
        });
    }
  }

  async createOrUpdateRoleByUid(uid: string, roleData: Role) {
    return set(ref(this.db, `/${this.tableName}/${uid}`), {
      email: roleData.email,
      role: roleData.role,
      name: roleData.name,
      canBeDeleted: roleData.canBeDeleted,
    }).catch((error) => {
      console.error("Error write data: ", error);
    });
  }
}
