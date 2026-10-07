import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_URL } from '../api.config';
import { RecordItem, User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);

  // delayMs maps to the backend ?delay= parameter (async demo)
  private params(delayMs: number) {
    return new HttpParams().set('delay', delayMs);
  }

  getMe(delayMs = 0) {
    return this.http.get<User>(`${API_URL}/me`, { params: this.params(delayMs) });
  }

  getRecords(delayMs = 0) {
    return this.http.get<RecordItem[]>(`${API_URL}/records`, { params: this.params(delayMs) });
  }
}