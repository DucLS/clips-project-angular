import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Injectable } from '@angular/core';
import {
  AbstractControl,
  AsyncValidator,
  ValidationErrors,
} from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class EmailTaken implements AsyncValidator {
  constructor(private auth: AngularFireAuth) {}

  validate = (control: AbstractControl): Promise<ValidationErrors | null> => {
    return (
      this.auth
        .fetchSignInMethodsForEmail(control.value)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then((response: any) =>
          response.length ? { emailTaken: true } : null
        )
    );
  };
}
