import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import IUser from 'src/app/models/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  name = new FormControl('', [Validators.required, Validators.minLength(3)]);
  email = new FormControl('', [Validators.required, Validators.email]);
  age = new FormControl<number | null>(null, [
    Validators.required,
    Validators.min(8),
    Validators.max(100),
  ]);
  password = new FormControl('', [
    Validators.required,
    Validators.pattern('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$'),
  ]);
  passwordConfirm = new FormControl('', [Validators.required]);
  phone = new FormControl('', [
    Validators.required,
    Validators.minLength(13),
    Validators.maxLength(13),
  ]);

  registerForm = new FormGroup({
    name: this.name,
    email: this.email,
    age: this.age,
    password: this.password,
    passwordConfirm: this.passwordConfirm,
    phone: this.phone,
  });

  isShowAlert = false;
  isSubmission = true;
  alertMsg = '';
  alertColor = '';

  constructor(private authService: AuthService) {}

  async register() {
    if (this.registerForm.invalid || !this.isSubmission) {
      return;
    }

    try {
      this.authService.createUser(this.registerForm.value as IUser);

      this.isShowAlert = true;
      this.alertMsg = 'Success! Your account has been created.';
      this.alertColor = 'green';
    } catch (e) {
      this.isShowAlert = true;
      this.alertMsg = 'An unexpected error occurred. Please try again!';
      this.alertColor = 'red';
      this.isSubmission = false;

      return;
    }
  }
}
