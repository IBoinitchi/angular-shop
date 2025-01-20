import { Component } from "@angular/core";
import { User } from "src/app/shared/interfaces";
import { RoleTypeEnum } from "src/app/shared/roleTypeEnum";
import { RoleService } from "src/app/shared/role.service";

@Component({
  selector: "app-users-list",
  templateUrl: "./user-list.component.html",
  styleUrls: ["./user-list.component.scss"],
})
export class UsersPageComponent {
  users: User[] = [];
  userRoleType = RoleTypeEnum;

  constructor(private roleService: RoleService) {}

  ngOnInit() {
    this.roleService.getUsersRoles().then((usersRoles) => {
      this.users = usersRoles;
    });
  }

  deleteUser(userIdKey: string) {}
}
