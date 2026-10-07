import { Component, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { RecordItem, User } from '../../core/models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private userService = inject(UserService);
  auth = inject(AuthService);

  profile = signal<User | null>(null);
  records = signal<RecordItem[]>([]);
  loadingProfile = signal(false);
  loadingRecords = signal(false);
  error = signal('');

  delayOptions = [0, 1500, 3000];
  delayMs = 0;

  constructor() {
    this.load();
  }

  load() {
    this.error.set('');
    this.loadingProfile.set(true);
    this.loadingRecords.set(true);

    // Two independent async calls: each section shows its own spinner
    this.userService
      .getMe(this.delayMs)
      .pipe(finalize(() => this.loadingProfile.set(false)))
      .subscribe({
        next: u => this.profile.set(u),
        error: () => this.error.set('Could not load profile.'),
      });

    this.userService
      .getRecords(this.delayMs * 2)
      .pipe(finalize(() => this.loadingRecords.set(false)))
      .subscribe({
        next: r => this.records.set(r),
        error: () => this.error.set('Could not load records.'),
      });
  }

  onDelayChange(value: string) {
    this.delayMs = Number(value);
    this.load();
  }
}