import { Directive, Input, TemplateRef, ViewContainerRef } from "@angular/core";
import { AuthService } from "../services/auth.service";

@Directive({
  selector: "[appAuthorized]",
  standalone: true,
})
export class AuthDirective {
  @Input() set appAuthorized(roles: string[]) {
    if (!roles.includes(this.auth.role) && !roles.includes("*")) {
      this.viewContainerRef.clear();
      return;
    }

    this.viewContainerRef.createEmbeddedView(this.templateRef);
  }

  constructor(
    private auth: AuthService,
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef
  ) {}
}
