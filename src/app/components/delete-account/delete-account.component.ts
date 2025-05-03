import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
/* import { AccountService } from '../../services/account.service'; */
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-delete-account',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.css']
})
export class DeleteAccountComponent {
  @Input() uid: string = '';
  showConfirmPopup = false;
  email = '';
  password = '';

  private router = inject(Router);
/*  private accountService = inject(AccountService);*/
  private auth = inject(Auth);

  toggleForm(): void {
    this.showConfirmPopup = !this.showConfirmPopup;
  }

  async confirmAndDelete(): Promise<void> {
    try {
      if (!this.email || !this.password) {
        alert('Debes introducir tu email y contraseña.');
        return;
      }

      await signInWithEmailAndPassword(this.auth, this.email, this.password);

      /* await this.accountService.deleteEntireAccount(this.uid); */

      localStorage.clear();
      this.router.navigate(['/']);
    } catch (error: any) {
      console.error('Error al eliminar la cuenta:', error);
      alert('Credenciales incorrectas o error al eliminar la cuenta.');
    }
  }
}
