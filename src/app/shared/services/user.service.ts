import { inject, Injectable } from "@angular/core";
import { User } from "../models/interfaces";
import { CrudService } from "./crud.service";
import { from, Observable } from "rxjs";
import { Functions, httpsCallable } from "@angular/fire/functions";
import { switchMap } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class UserService extends CrudService<User> {
  tableName = "users";
	private functions = inject(Functions);

	getAllData(): Observable<any> {
		const getAllFirebaseUsers = httpsCallable(this.functions, "getAllUsers");
		return from(getAllFirebaseUsers()).pipe(
			switchMap(({data}: any) => [data])
		);
	}

  getOneById(id: string): Observable<any> {
    const getFirebaseUser = httpsCallable(this.functions, "getUser");
    return from(getFirebaseUser({id})).pipe(
			switchMap(({data}: any) => [data])
		);
  }

	createUser(data: User): Observable<any> {
		const createFirebaseUser = httpsCallable(this.functions, "createUser");
		return from(createFirebaseUser(data));
	}

	updateUser(data: User): Observable<any> {
		const updateFirebaseUser = httpsCallable(this.functions, "updateUser");
		return from(updateFirebaseUser(data));
	}

	deleteUser(id: string): Observable<any> {
		const deleteFirebaseUser = httpsCallable(this.functions, "deleteUser");
		return from(deleteFirebaseUser({id}));
	} 
}
