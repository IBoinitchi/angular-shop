import { Directive, Input, TemplateRef, ViewContainerRef } from "@angular/core";
import { AuthService } from "./auth.service";

@Directive({
  selector: "[appAuthorized]",
  standalone: true,
})
export class AuthorizedDirective {
  @Input() set appAuthorized(role: string) {
    console.log(role); // this will print: AGENT
  }

  constructor(
    private auth: AuthService,
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef
  ) {}
}
