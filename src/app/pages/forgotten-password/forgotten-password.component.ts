import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-forgotten-password',
  standalone: true,
  templateUrl: './forgotten-password.component.html',
  styleUrls: ['./forgotten-password.component.css'],
  imports: [CommonModule, FormsModule, RouterLink]
})
export class ForgottenPasswordComponent {
  email: string = '';
  message: string = '';
  sending: boolean = false;
  cooldown: number = 0;
  intervalId: any = null;

  constructor(private authService: AuthService) {}

  async onSubmit() {
    if (this.cooldown > 0 || this.sending) return;

    this.message = '';
    this.sending = true;

    try {
      await this.authService.sendPasswordReset(this.email);
      this.message = 'Se ha enviado un correo de recuperación a tu dirección de email.';
      this.startCooldown(60); // Tiempo de espera en segundos
    } catch (err: any) {
      this.message = err.message || 'Error al enviar el correo de recuperación.';
    } finally {
      this.sending = false;
    }
  }

  startCooldown(seconds: number) {
    this.cooldown = seconds;
    this.intervalId = setInterval(() => {
      this.cooldown--;
      if (this.cooldown <= 0) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    }, 1000);
  }
}
