import { inject, Injectable } from "@angular/core";
import { DisplayUser } from "../models/interfaces";
import { CrudService } from "./crud.service";
import { from, Observable } from "rxjs";
import { Functions, httpsCallable } from "@angular/fire/functions";
import { switchMap } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class UserService extends CrudService<DisplayUser> {
  tableName = "";
  private functions = inject(Functions);

  getAllData(): Observable<DisplayUser[]> {
    const getAllFirebaseUsers = httpsCallable(this.functions, "getAllUsers");
    return from(getAllFirebaseUsers()).pipe(switchMap(({ data }) => [data]));
  }

  getOneById(id: string): Observable<DisplayUser> {
    const getFirebaseUser = httpsCallable(this.functions, "getUser");
    return from(getFirebaseUser({ id })).pipe(switchMap(({ data }) => [data]));
  }

  createUser(data: DisplayUser): Observable<any> {
    const createFirebaseUser = httpsCallable(this.functions, "createUser");
    return from(createFirebaseUser(data));
  }

  updateUser(data: DisplayUser): Observable<any> {
    const updateFirebaseUser = httpsCallable(this.functions, "updateUser");
    return from(updateFirebaseUser(data));
  }

  deleteUser(id: string): Observable<any> {
    const deleteFirebaseUser = httpsCallable(this.functions, "deleteUser");
    return from(deleteFirebaseUser({ id }));
  }
}
