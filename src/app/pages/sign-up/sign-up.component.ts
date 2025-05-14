import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements AfterViewInit {
  email = '';
  password = '';
  username = '';
  confirmPassword = '';


  @ViewChild('usernameRequirements') usernameReq?: ElementRef;
  @ViewChild('passwordRequirements') passwordReq?: ElementRef;

  private authService = inject(AuthService);
  private userService = inject(UserService);

  constructor(private router: Router) {}

  ngAfterViewInit(): void {}

  showElement(el?: ElementRef) {
    if (el?.nativeElement) {
      el.nativeElement.style.display = 'block';
    }
  }

  hideElement(el?: ElementRef) {
    if (el?.nativeElement) {
      el.nativeElement.style.display = 'none';
    }
  }

  onUsernameFocus() {
    this.showElement(this.usernameReq);
  }

  onUsernameBlur() {
    this.hideElement(this.usernameReq);
  }

  onPasswordFocus() {
    this.showElement(this.passwordReq);
  }

  onPasswordBlur() {
    this.hideElement(this.passwordReq);
  }

  validateUsername() {
    if (this.username.trim() === '') {
      ['first-letter', 'alphanumeric', 'length'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          el.classList.remove('valid');
          const span = el.querySelector('span');
          if (span) {
            span.style.display = 'none';
          }
        }
      });
      return;
    }

    const rules: Record<string, boolean> = {
      'first-letter': /^[A-Za-z]/.test(this.username),
      'alphanumeric': /^[A-Za-z0-9]+$/.test(this.username),
      'length': this.username.length >= 5
    };

    Object.entries(rules).forEach(([id, isValid]) => {
      const el = document.getElementById(id);
      if (el) {
        el.classList.toggle('valid', isValid);
        const span = el.querySelector('span');
        if (span) {
          span.style.display = isValid ? 'inline' : 'none';
        }
      }
    });
  }

  validatePassword() {
    if (this.password.trim() === '') {
      ['password-length', 'password-uppercase', 'password-lowercase', 'password-number', 'password-special'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          el.classList.remove('valid');
          const span = el.querySelector('span');
          if (span) {
            span.style.display = 'none';
          }
        }
      });
      return;
    }

    const rules: Record<string, boolean> = {
      'password-length': this.password.length >= 8,
      'password-uppercase': /[A-Z]/.test(this.password),
      'password-lowercase': /[a-z]/.test(this.password),
      'password-number': /\d/.test(this.password),
      'password-special': /[@$!%*?&]/.test(this.password)
    };

    Object.entries(rules).forEach(([id, isValid]) => {
      const el = document.getElementById(id);
      if (el) {
        el.classList.toggle('valid', isValid);
        const span = el.querySelector('span');
        if (span) {
          span.style.display = isValid ? 'inline' : 'none';
        }
      }
    });
  }

  async onSubmit(event: Event) {
    event.preventDefault();

    const isUsernameValid = ['first-letter', 'alphanumeric', 'length'].every(id =>
      document.getElementById(id)?.classList.contains('valid')
    );

    const isPasswordValid = [
      'password-length',
      'password-uppercase',
      'password-lowercase',
      'password-number',
      'password-special'
    ].every(id => document.getElementById(id)?.classList.contains('valid'));

    if (!isUsernameValid || !isPasswordValid) {
      alert('Corrige los errores antes de continuar.');
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    try {
      const user = await this.authService.registerUser(this.email, this.password, this.username);

      if (user) {
        await this.userService.saveUserData(
          user.uid,
          user.email!,
          this.username,
          user.emailVerified
        );

        alert('Usuario creado exitosamente. Se ha enviado un correo de verificación.');
        this.router.navigate(['/sign-in']);
      }
    } catch (error: any) {
      alert(`Error al crear usuario: ${error.message}`);
    }
  }

  goToSignIn() {
    this.router.navigate(['/sign-in']);
  }
}
