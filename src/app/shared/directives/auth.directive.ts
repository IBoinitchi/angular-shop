import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  OnDestroy,
} from "@angular/core";
import { AuthService } from "../services/auth.service";
import { Subscription } from "rxjs";
import { AuthenticateUser } from "../models/interfaces";

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

  constructor(
    private auth: AuthService,
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef
  ) {}

  private updateView() {
    this.subscription = this.auth.currentUser$.subscribe({
      next: (user: AuthenticateUser) => {
        if (!this.roles.includes(user.role) && !this.roles.includes("*")) {
          this.viewContainerRef.clear();
          return;
        }
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      },
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
