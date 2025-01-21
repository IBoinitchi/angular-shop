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
import { CrudService } from "./crud.service";

@Injectable({
  providedIn: "root",
})
export class RoleService extends CrudService {
  tableName = "users";

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

  createOrUpdateRoleByUid(uid: string, roleData: Role) {
    return this.createOrUpdateById(uid, {
      email: roleData.email,
      role: roleData.role,
      name: roleData.name,
      canBeDeleted: roleData.canBeDeleted,
    });
  }
}
