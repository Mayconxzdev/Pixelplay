import { Injectable, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, signOut, User } from '@angular/fire/auth';
import { Firestore, doc, setDoc, serverTimestamp } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

export interface AuthError {
  code: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.auth.onAuthStateChanged(user => {
      this.currentUserSubject.next(user);
    });
  }

  async register(email: string, password: string, displayName: string): Promise<void> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      await this.createUserDocument(userCredential.user, displayName);
      await updateProfile(userCredential.user, { displayName });
    } catch (error) {
      throw this.parseFirebaseError(error);
    }
  }

  private async createUserDocument(user: User, displayName: string) {
    try {
      await setDoc(doc(this.firestore, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName,
        createdAt: serverTimestamp(),
        photoURL: user.photoURL || null
      });
    } catch (firestoreError) {
      console.error('Firestore error:', firestoreError);
    }
  }

  private parseFirebaseError(error: unknown): AuthError {
    if (typeof error === 'object' && error !== null && 'code' in error && 'message' in error) {
      return {
        code: (error as {code: string}).code.replace('auth/', ''),
        message: (error as {message: string}).message
      };
    }
    return {
      code: 'unknown',
      message: 'Ocorreu um erro desconhecido'
    };
  }

  async registerSimple(email: string, password: string): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw this.parseFirebaseError(error);
    }
  }

  async login(email: string, password: string): Promise<void> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
    } catch (error) {
      throw this.parseFirebaseError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error) {
      throw this.parseFirebaseError(error);
    }
  }

  isAuthenticated(): Observable<boolean> {
    return this.currentUser$.pipe(
      map(user => !!user)
    );
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}