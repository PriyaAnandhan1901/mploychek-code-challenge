export type Role = 'General User' | 'Admin';

export interface User {
  id: number;
  userId: string;
  name: string;
  email: string;
  role: Role;
}

export interface LoginRequest {
  userId: string;
  password: string;
  role: Role;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RecordItem {
  id: number;
  title: string;
  owner: string;
  accessLevel: 'Public' | 'Internal' | 'Confidential';
}