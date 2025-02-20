import { Injectable, NgZone } from "@angular/core";
import { AuthErrorCodes } from "@angular/fire/auth";
import { ToastrService } from "ngx-toastr";
import { AppError } from "../models/interfaces";

@Injectable({
  providedIn: "root",
})
export class ErrorService {
  constructor(private toastr: ToastrService, private ngZone: NgZone) {}

  handleFirebaseError(error: AppError, title: string = "Firebase"): void {
    const message = this.getFirebaseErrorMessage(error.code);
    this.ngZone.run(() => {
      this.toastr.error(message, title);
    });
  }

  handleHttpError(error: AppError): void {
    this.ngZone.run(() => {
      this.toastr.error(`HTTP: ${error.status} - ${error.message}`, "API");
    });
  }

  handleGenericError(): void {
    this.ngZone.run(() => {
      this.toastr.error("Something is wrong, please try again later.", "Error");
    });
  }

  private getFirebaseErrorMessage(code: string): string {
    const messages: { [key: string]: string } = {
      [AuthErrorCodes.INVALID_LOGIN_CREDENTIALS]:
        "Incorrect email address or password entered",
      [AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER]:
        "Please try again later, too many requests have been sent.",
    };
    return messages[code] || "Something is wrong, please try again later.";
  }
}
