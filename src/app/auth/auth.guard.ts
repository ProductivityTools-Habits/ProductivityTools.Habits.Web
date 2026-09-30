import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';

// Protects authenticated routes. Waits for Firebase to restore the
// persisted session before deciding, so a page refresh doesn't bounce
// a logged-in user to /login.
export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  await authService.authReady;

  if (authService.isLoggedIn()) {
    return true;
  }

  // Redirect to login page
  return router.createUrlTree(['/login']);
};

// Keeps already-authenticated users away from the login page.
export const loginGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  await authService.authReady;

  if (authService.isLoggedIn()) {
    return router.createUrlTree(['/execution']);
  }

  return true;
};
