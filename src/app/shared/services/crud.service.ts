import { Injectable, inject } from "@angular/core";
import {
  Database,
  ref,
  get,
  set,
  child,
  push,
  update,
  remove,
  onValue,
  DatabaseReference,
} from "@angular/fire/database";
import { from, Observable, of } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export abstract class CrudService<T> {
  protected db = inject(Database);
  protected tableName: string = null;

  // Helper function to create a reference
  protected createRef(path: string): DatabaseReference {
    return ref(this.db, path);
  }

  // Helper function to check if data exists
  protected checkIfExists(refPath: string): Observable<boolean> {
    return from(get(this.createRef(refPath))).pipe(
      map((snapshot) => snapshot.exists()),
      catchError((error) => {
        console.error(`Error checking existence for ${refPath}:`, error);
        throw error;
      })
    );
  }

  create(data: Partial<T>): Observable<void> {
    const recordId = push(child(ref(this.db), this.tableName)).key;
    const dataWithId = { ...data, id: recordId };

    return from(
      set(this.createRef(`/${this.tableName}/${recordId}`), dataWithId)
    ).pipe(
      catchError((error) => {
        console.error(`Error creating data in table ${this.tableName}:`, error);
        throw error;
      })
    );
  }

  getAllData(): Observable<T[]> {
    this.checkIfExists(this.tableName);
    return new Observable((observer) => {
      onValue(this.createRef(this.tableName), (snapshot) => {
        const oldData = snapshot.val();
        const newData = Object.keys(oldData).map((key) => ({
          ...oldData[key],
          id: key,
        })) as T[];
        return observer.next(newData);
      });
    });
  }

  getOneById(id: string): Observable<T | null> {
    this.checkIfExists(this.tableName);
    const path = `/${this.tableName}/${id}`;

    return new Observable((observer) => {
      onValue(this.createRef(path), (snapshot) => {
        return observer.next(snapshot.val());
      });
    });
  }

  update(id: string, data: Partial<T>): Observable<void | null> {
    const path = `/${this.tableName}/${id}`;
    return this.checkIfExists(path).pipe(
      switchMap((exists) => {
        if (!exists) {
          console.warn(
            `Record not found in table ${this.tableName} with id ${id}`
          );
          return of(null);
        }
        return from(update(this.createRef(path), data));
      })
    );
  }

  delete(id: string): Observable<void> {
    const path = `/${this.tableName}/${id}`;
    return this.checkIfExists(path).pipe(
      switchMap((exists) => {
        if (!exists) {
          console.warn(
            `Record not found in table ${this.tableName} with id ${id}`
          );
          return of(null);
        }
        return from(remove(this.createRef(path)));
      })
    );
  }

  createOrUpdateById(id: string, data: Partial<T>): Observable<void> {
    const path = `/${this.tableName}/${id}`;

    return from(set(this.createRef(path), data));
  }
}
