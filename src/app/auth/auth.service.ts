import { Injectable, inject, signal } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  Auth,
  getAuth,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  User,
  onAuthStateChanged,
  getIdToken
} from 'firebase/auth';
import { firebaseConfig } from '../firebase.config';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  private auth: Auth;
  private googleProvider: GoogleAuthProvider;
  private readonly STORAGE_KEY = 'user_session';

  // Signal to track current user
  currentUser = signal<User | null>(null);
  isAuthenticated = signal<boolean>(false);

  constructor() {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    this.auth = getAuth(app);
    this.googleProvider = new GoogleAuthProvider();

    // Listen to auth state changes
    onAuthStateChanged(this.auth, (user) => {
      this.currentUser.set(user);
      this.isAuthenticated.set(!!user);
      console.log('Auth state changed:', user ? user.email : 'No user');
    });
  }

  // Sign in with Google
  async signInWithGoogle(): Promise<void> {
    try {
      const result = await signInWithPopup(this.auth, this.googleProvider);
      console.log('Successfully signed in:', result.user.email);
      debugger;
      this.saveSession(result.user);
      this.router.navigate(['/execution']);
    } catch (error: any) {
      console.error('Error signing in:', error);
      throw error;
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      await signOut(this.auth);
      console.log('Successfully signed out');
      this.router.navigate(['/login']);
    } catch (error: any) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  private get isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.currentUser();
  }

  // Check if user is authenticated
  isLoggedIn(): boolean {
    debugger;
    const user = this.auth.currentUser;
    if (user) {
      return true;
    }

    // Check local storage
    this.restoreSession();
    return this.isAuthenticated();
  }

  private async saveSession(user: User): Promise<void> {
    if (!this.isBrowser) return;

    // Store minimal user info needed to satisfy hydration
    const token = await getIdToken(user);
    const userInfo = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      token: token
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(userInfo));
  }

  private restoreSession(): void {
    if (!this.isBrowser) return;

    const storedUser = localStorage.getItem(this.STORAGE_KEY);
    if (storedUser) {
      try {
        const userInfo = JSON.parse(storedUser);
        // Optimistically set the user. Firebase will verify later.
        // We can't cast directly to User as it has methods, but we can stick it in the signal for minimal checks
        this.isAuthenticated.set(true);
      } catch (e) {
        console.error('Error parsing stored session', e);
        this.clearSession();
      }
    }
  }

  private clearSession(): void {
    if (!this.isBrowser) return;
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // Get Firebase ID token for API authentication
  async getIdToken(): Promise<string | null> {
    try {
      const user = this.auth.currentUser;
      if (user) {
        const token = await getIdToken(user);
        return token;
      } else if (this.isBrowser) {
        // Try to get token from local storage
        const storedUser = localStorage.getItem(this.STORAGE_KEY);
        if (storedUser) {
          const userInfo = JSON.parse(storedUser);
          return userInfo.token;
        }
      }
      return null;
    } catch (error) {
      console.error('Error getting ID token:', error);
      return null;
    }
  }
}

