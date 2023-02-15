import { Component } from '@angular/core';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent {
  constructor(public modal: ModalService) {}

  openModal($event: Event) {
    $event.preventDefault();
    this.modal.toggleModal('auth');
  }
}
