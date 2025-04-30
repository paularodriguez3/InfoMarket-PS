import {Component, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import { Router } from '@angular/router';

export interface User {
  name: string,
  username: string,
  surname: string,
  email: string,
  tlf: string
}

@Component({
  selector: 'app-personal-profile',
  standalone: true,
  templateUrl: './personal-profile.component.html',
  imports: [
    FormsModule
  ],
  styleUrl: './personal-profile.component.css'
})
export class PersonalProfileComponent {
  router: Router = inject(Router);

    user: User = {
      name: "Kevin",
      username: "kevinjfa",
      surname: "Falcón",
      email: "kevinjfa@infomarket.es",
      tlf: "123456789"
    };

  uploadChanges() {
    //TODO: use firestore service to upload changes
  }

  signOut() {
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }
}
