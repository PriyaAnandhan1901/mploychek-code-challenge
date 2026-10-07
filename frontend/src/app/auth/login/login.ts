import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { Role } from '../../core/models/user.model';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  roles: Role[] = ['General User', 'Admin'];
  loading = signal(false);
  error = signal('');

  form = this.fb.nonNullable.group({
    userId: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['General User' as Role, Validators.required],
    simulateDelay: [false],
  });

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { simulateDelay, ...creds } = this.form.getRawValue();
    this.loading.set(true);
    this.error.set('');

    this.auth
      .login(creds, simulateDelay ? 2500 : 0)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: err =>
          this.error.set(err.error?.message ?? 'Cannot reach the server. Is the API running?'),
      });
  }
}