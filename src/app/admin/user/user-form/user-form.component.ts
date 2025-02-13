import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { RoleTypeEnum } from "src/app/shared/models/roleTypeEnum";
import { UserService } from "src/app/shared/services/user.service";
import { DisplayUser } from "src/app/shared/models/interfaces";

@Component({
  selector: "app-user-form",
  templateUrl: "./user-form.component.html",
  styleUrls: ["./user-form.component.scss"],
})
export class UserFormComponent {
  form: FormGroup;
  isSubmit = false;
  user = <DisplayUser>{};
  userRoleType = RoleTypeEnum;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.user.id = this.route.snapshot.params["id"];
    if (this.user.id) {
      this.loadUserData();
    } else {
      this.initializeForm();
    }
  }

  private loadUserData() {
    this.userService.getOneById(this.user.id).subscribe({
      next: (userData) => {
        if (!userData.canBeDeleted) {
          this.finalAction();
        }

        this.user = { ...this.user, ...userData };
        this.initializeForm();
      },
    });
  }

  private initializeForm() {
    this.form = new FormGroup({
      name: new FormControl(this.user?.name || "", Validators.required),
      email: new FormControl(this.user?.email || "", [
        Validators.required,
        Validators.email,
      ]),
      role: new FormControl(this.user?.role || "", Validators.required),
      password: new FormControl(this.user?.password || "", [
        Validators.minLength(6),
      ]),
    });
  }

  private finalAction() {
    this.isSubmit = false;
    this.router.navigate(["/admin", "users"]);
  }

  submit() {
    if (this.form.invalid) {
      return;
    }

    this.isSubmit = true;
    const userData: DisplayUser = {
      ...this.user,
      ...this.form.value,
    };

    if (!!this.user.id) {
      this.userService.updateUser(userData).subscribe(() => this.finalAction());
    } else {
      this.userService.createUser(userData).subscribe(() => this.finalAction());
    }
  }
}
