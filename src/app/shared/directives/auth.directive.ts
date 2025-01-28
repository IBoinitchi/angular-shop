import { Directive, Input, TemplateRef, ViewContainerRef, OnDestroy } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { Subscription } from "rxjs";

@Directive({
  selector: "[appAuthorized]",
  standalone: true,
})
export class AuthDirective implements OnDestroy {
  @Input() set appAuthorized(roles: string[]) {
    this.roles = roles;
    this.updateView(); 
  }

  private roles: string[] = [];
  private subscription: Subscription;
  private currentRole: any = null;

  constructor(
    private auth: AuthService,
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef
  ) {
    this.subscription = this.auth.userRole$.subscribe((role) => {
      this.currentRole = role;
      this.updateView();
    });
  }

  private updateView() {
    if (!this.currentRole || (!this.roles.includes(this.currentRole) && !this.roles.includes("*"))) {
      this.viewContainerRef.clear();
      return;
    }

    this.viewContainerRef.createEmbeddedView(this.templateRef);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
