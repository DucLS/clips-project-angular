import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  credentials = {
    email: '',
    password: '',
  };
  isShowAlert = false;
  alertMsg = 'Please wait! We are loggin you in.';
  alertColor = 'blue';
  isSubmission = true;

  constructor(private auth: AngularFireAuth) {}

  async login() {
    const { email, password } = this.credentials;
    this.isShowAlert = true;

    try {
      await this.auth.signInWithEmailAndPassword(email, password);

      this.alertMsg = 'Success! You are now logged in';
      this.alertColor = 'blue';
    } catch (error) {
      this.isSubmission = false;
      this.alertMsg = 'An unexpected error occurred. Please try again late!';
      this.alertColor = 'red';
    }

    this.isSubmission = true;
  }
}
