import { Component } from "@angular/core";
import { Observable } from "rxjs";
import { User } from "src/app/shared/models/interfaces";
import { RoleTypeEnum } from "src/app/shared/models/roleTypeEnum";
import { RoleService } from "src/app/shared/services/role.service";

@Component({
  selector: "app-user-list",
  templateUrl: "./user-list.component.html",
  styleUrls: ["./user-list.component.scss"],
})
export class UserListComponent {
  users$: Observable<User[]> = null;
  userRoleType = RoleTypeEnum;

  constructor(private roleService: RoleService) {}

  ngOnInit() {
    this.users$ = this.roleService.getAllData();
  }

  deleteUser(userIdKey: string) {}
}
