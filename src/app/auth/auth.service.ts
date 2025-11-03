import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
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
  private platformId = inject(PLATFORM_ID);
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

    // Try to restore session from localStorage immediately
    this.restoreSession();

    // Listen to auth state changes
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.saveSession(user);
        this.currentUser.set(user);
        this.isAuthenticated.set(true);
      } else {
        this.clearSession();
        this.currentUser.set(null);
        this.isAuthenticated.set(false);
      }
      console.log('Auth state changed:', user ? user.email : 'No user');
    });
  }

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private saveSession(user: User): void {
    if (this.isBrowser) {
      // Store minimal user info needed to satisfy hydration
      const userInfo = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(userInfo));
    }
  }

  private clearSession(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  private restoreSession(): void {
    if (this.isBrowser) {
      const storedUser = localStorage.getItem(this.STORAGE_KEY);
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser) as User;
          // Optimistically set the user. Firebase will verify later.
          this.currentUser.set(user);
          this.isAuthenticated.set(true);
        } catch (e) {
          console.error('Error parsing stored session', e);
          this.clearSession();
        }
      }
    }
  }

  // Sign in with Google
  async signInWithGoogle(): Promise<void> {
    try {
      const result = await signInWithPopup(this.auth, this.googleProvider);
      console.log('Successfully signed in:', result.user.email);
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
      this.clearSession(); // Explicitly clear local storage
      console.log('Successfully signed out');
      this.router.navigate(['/login']);
    } catch (error: any) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.currentUser();
  }

  // Check if user is authenticated
  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  // Get Firebase ID token for API authentication
  async getIdToken(): Promise<string | null> {
    try {
      const user = this.auth.currentUser;
      if (user) {
        const token = await getIdToken(user);
        return token;
      }
      return null;
    } catch (error) {
      console.error('Error getting ID token:', error);
      return null;
    }
  }
}
