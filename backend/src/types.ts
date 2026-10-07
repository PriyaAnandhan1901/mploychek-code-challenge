export type Role = 'General User' | 'Admin';

export interface User {
  id: number;
  userId: string;
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
}