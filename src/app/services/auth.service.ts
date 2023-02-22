import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import IUser from '../models/user.model';
import { map, delay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usersCollection: AngularFirestoreCollection<IUser>;
  public isAuthenticated$: Observable<boolean>;
  public isAuthenticatedWithDelay$: Observable<boolean>;

  constructor(private auth: AngularFireAuth, private db: AngularFirestore) {
    this.usersCollection = db.collection('users');
    this.isAuthenticated$ = auth.user.pipe(map((user) => !!user));
    this.isAuthenticatedWithDelay$ = this.isAuthenticated$.pipe(delay(500));
  }

  public async createUser(user: IUser) {
    const { name, email, password, age, phone } = user;

    try {
      const credential = await this.auth.createUserWithEmailAndPassword(
        email as string,
        password as string
      );

      if (!credential.user) {
        throw new Error("User can't be found");
      }

      await this.usersCollection.doc(credential.user.uid).set({
        name,
        email,
        age,
        phone,
      });

      await credential.user.updateProfile({
        displayName: name,
      });
    } catch (error) {
      throw error;
    }
  }
}
