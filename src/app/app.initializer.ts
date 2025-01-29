import { AuthService } from "./shared/services/auth.service";

export function initializeApp(authService: AuthService): () => Promise<void> {
  return () => {
    if (authService.isAuthenticated()) {
      return authService.loadUserRole();
    }

    return null;
  };
}