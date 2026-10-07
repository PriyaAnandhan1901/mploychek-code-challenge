import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { API_URL } from '../api.config';
import { LoginRequest, LoginResponse, User } from '../models/user.model';

const TOKEN_KEY = 'mc_token';
const USER_KEY = 'mc_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private _token = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  private _user = signal<User | null>(this.readUser());

  readonly user = this._user.asReadonly();
  readonly isLoggedIn = computed(() => !!this._token());
  readonly isAdmin = computed(() => this._user()?.role === 'Admin');

  get token(): string | null {
    return this._token();
  }

  // delayMs lets you demo the async loading state (backend ?delay=)
  login(body: LoginRequest, delayMs = 0) {
    const params = new HttpParams().set('delay', delayMs);
    return this.http.post<LoginResponse>(`${API_URL}/login`, body, { params }).pipe(
      tap(res => {
        localStorage.setItem(TOKEN_KEY, res.token);
        localStorage.setItem(USER_KEY, JSON.stringify(res.user));
        this._token.set(res.token);
        this._user.set(res.user);
      })
    );
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this._token.set(null);
    this._user.set(null);
    this.router.navigate(['/login']);
  }

  private readUser(): User | null {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY) ?? 'null');
    } catch {
      return null;
    }
  }
}