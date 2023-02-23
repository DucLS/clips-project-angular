import { Component } from '@angular/core';
import { ModalService } from '../services/modal.service';
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent {
  isAuthenticated = false;

  constructor(public modal: ModalService, public auth: AuthService) {
    this.auth.isAuthenticated$.subscribe((status) => {
      this.isAuthenticated = status;
    });
  }

  openModal($event: Event) {
    $event.preventDefault();
    this.modal.toggleModal('auth');
  }
}
