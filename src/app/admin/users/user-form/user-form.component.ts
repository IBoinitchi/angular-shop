import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { RoleTypeEnum } from "src/app/shared/roleTypeEnum";
import { RoleService } from "src/app/shared/role.service";
import { User } from "src/app/shared/interfaces";

@Component({
  selector: "app-user-form",
  templateUrl: "./user-form.component.html",
  styleUrls: ["./user-form.component.scss"],
})
export class UserFormComponent {
  form: FormGroup;
  isSubmit = false;
  isNew = true;
  user = null;
  userRoleType = RoleTypeEnum;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private roleService: RoleService
  ) {}

  ngOnInit() {
    const userIdKey = this.route.snapshot.params["id"];
    if (userIdKey) {
      this.loadUserData(userIdKey);
    } else {
      this.initializeForm();
    }
  }

  private loadUserData(userIdKey: string) {
    this.isNew = false;

    this.roleService.getRoleByUserId(userIdKey).then((userData) => {
      this.user = userData;
      this.initializeForm(this.user);
    });
  }

  private initializeForm(user?: any) {
    this.form = new FormGroup({
      name: new FormControl(user?.name || "", Validators.required),
      email: new FormControl(user?.email || "", [
        Validators.required,
        Validators.email,
      ]),
      role: new FormControl(user?.role || "", Validators.required),
      password: new FormControl(user?.password || "", [
        Validators.minLength(6),
      ]),
    });
  }

  submit() {
    if (this.form.invalid) {
      return;
    }

    this.isSubmit = true;
    const userData: User = {
      ...this.user,
      ...this.form.value,
    };

    if (!this.isNew) {
      this.roleService.updateUser(userData).then(() => {
        this.isSubmit = false;
        this.router.navigate(["/admin", "users"]);
      });
    }
  }
}
