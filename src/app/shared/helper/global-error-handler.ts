import { ErrorService } from "../services/error.service";
import { ErrorHandler, Injectable, Injector } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private errorService: ErrorService;

  constructor(private injector: Injector) {}

  private getErrorService(): ErrorService {
    if (!this.errorService) {
      this.errorService = this.injector.get(ErrorService);
    }
    return this.errorService;
  }

  handleError(error: any): void {
    if (!environment.production) {
      console.error(error);
    }

    if (typeof error === "function") {
      error = error();
    }

    const handlerKey = Object.keys(this.errorHandlers).find((key) =>
      error?.code?.includes(key)
    );

    if (handlerKey) {
      this.errorHandlers[handlerKey](error);
    } else {
      this.errorHandlers["default"](error);
    }
  }

  private errorHandlers: { [key: string]: (error: any) => void } = {
    "auth/": (error) => this.handleFirebaseError(error),
    "permission-denied": (error) => this.handleFirebaseError(error),
    "functions/": (error) => this.handleHttpError(error),
    default: (error) => this.handleGenericError(error),
  };

  private handleFirebaseError(error: any): void {
    this.getErrorService().handleFirebaseError(error);
  }

  private handleHttpError(error: any): void {
    this.getErrorService().handleHttpError(error);
  }

  private handleGenericError(error: any): void {
    this.getErrorService().handleGenericError(error);
  }
}
