import { Component } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { DisplayUser } from "src/app/shared/models/interfaces";
import { RoleTypeEnum } from "src/app/shared/models/roleTypeEnum";
import { UserService } from "src/app/shared/services/user.service";

@Component({
  selector: "app-user-list",
  templateUrl: "./user-list.component.html",
  styleUrls: ["./user-list.component.scss"],
})
export class UserListComponent {
  users$: Observable<DisplayUser[]> = null;
  userRoleType = RoleTypeEnum;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.users$ = this.userService.getAllData();
  }

  deleteUser(userId: string) {
    this.userService.deleteUser(userId).subscribe({
      next: () => {
        this.users$ = this.users$.pipe(
          map((users: DisplayUser[]) =>
            users.filter((user) => user.id !== userId)
          )
        );
      }
    });
  }
}
