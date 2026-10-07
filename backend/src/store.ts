import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { User } from './types';

const dir = path.join(__dirname, 'data');
const file = path.join(dir, 'users.json');

function seed(): User[] {
  return [
    { id: 1, userId: 'admin', name: 'Admin User', email: 'admin@demo.com',
      passwordHash: bcrypt.hashSync('Admin@123', 10), role: 'Admin' },
    { id: 2, userId: 'priya', name: 'Priya Anandhan', email: 'priya@demo.com',
      passwordHash: bcrypt.hashSync('User@123', 10), role: 'General User' },
  ];
}

export function loadUsers(): User[] {
  if (!fs.existsSync(file)) {
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(file, JSON.stringify(seed(), null, 2));
  }
  return JSON.parse(fs.readFileSync(file, 'utf-8'));
}

export function saveUsers(users: User[]): void {
  fs.writeFileSync(file, JSON.stringify(users, null, 2));
}