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

