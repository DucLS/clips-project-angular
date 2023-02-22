import { Component } from '@angular/core';
import { ModalService } from '../services/modal.service';
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent {
  isAuthenticated = false;

  constructor(
    public modal: ModalService,
    public auth: AuthService,
    private afAuth: AngularFireAuth
  ) {
    this.auth.isAuthenticated$.subscribe((status) => {
      this.isAuthenticated = status;
    });
  }

  openModal($event: Event) {
    $event.preventDefault();
    this.modal.toggleModal('auth');
  }

  async logout($event: Event) {
    $event.preventDefault();

    await this.afAuth.signOut();
  }
}
