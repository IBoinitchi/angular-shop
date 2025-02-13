import { Injectable, NgZone } from "@angular/core";
import { AuthErrorCodes } from "@angular/fire/auth";
import { ToastrService } from "ngx-toastr";

@Injectable({
  providedIn: "root",
})
export class ErrorService {
  constructor(private toastr: ToastrService, private ngZone: NgZone) {}

  handleFirebaseError(error: any, title: string = "Firebase"): void {
    const message = this.getFirebaseErrorMessage(error.code);
    this.ngZone.run(() => {
      this.toastr.error(message, title);
    });
  }

  handleHttpError(error: any): void {
    this.ngZone.run(() => {
      this.toastr.error(`HTTP: ${error.status} - ${error.message}`, "API");
    });
  }

  handleGenericError(error: any): void {
    this.ngZone.run(() => {
      this.toastr.error("Something is wrong, please try again later.", "Error");
    });
  }

  private getFirebaseErrorMessage(code: string): string {
    const messages: { [key: string]: string } = {
      "auth/invalid-login-credentials":
        "Incorrect email address or password entered",
      [AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER]:
        "Please try again later, too many requests have been sent.",
    };
    return messages[code] || "Something is wrong, please try again later.";
  }
}
