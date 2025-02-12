import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { finalize } from "rxjs/operators";
import { AuthService } from "src/app/shared/services/auth.service";
import { ServerMessage } from "src/app/shared/models/interfaces";
import { AuthErrorCodes } from "firebase/auth";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-login-page",
  templateUrl: "./login-page.component.html",
  styleUrls: ["./login-page.component.scss"],
})
export class LoginPageComponent implements OnInit {
  submitted = false;
  form = new FormGroup({
    email: new FormControl(null),
    password: new FormControl(null),
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    });
  }

  get fc() {
    return this.form.controls;
  }

  submit() {
    if (this.form.invalid) {
      return;
    }

    this.submitted = true;

    this.authService
      .login(this.form.value.email, this.form.value.password)
      .pipe(finalize(() => (this.submitted = false)))
      .subscribe({
        next: () => {
          this.router.navigate(["/admin"]);
        },
      });
  }
}
