import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {Router, RouterModule} from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  email = '';
  password = '';

  private authService = inject(AuthService);

  constructor(private router: Router) {}

  ngOnInit() {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      const user = JSON.parse(storedUser);

      if (user.emailVerified) {
        this.router.navigate(['/personal-profile']);
      } else {
        localStorage.removeItem('currentUser');
      }
    }
  }

  async onSubmit(event: Event) {
    event.preventDefault();

    try {
      const user = await this.authService.signIn(this.email, this.password);

      if (!user.emailVerified) {
        alert('Debes verificar tu correo electrónico antes de iniciar sesión.');
        return;
      }

      localStorage.setItem('currentUser', JSON.stringify({
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        emailVerified: user.emailVerified
      }));

      alert('Inicio de sesión exitoso.');
      this.router.navigate(['/personal-profile']);
    } catch (error: any) {
      if (error.code === 'auth/wrong-password') {
        alert('Contraseña incorrecta');
      } else if (error.code === 'auth/user-not-found') {
        alert('Usuario no encontrado');
      } else {
        alert('Error al iniciar sesión: ' + error.message);
      }
    }
  }

  goToSignUp() {
    this.router.navigate(['/sign-up']);
  }
}
