import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { loadUsers, saveUsers } from './store';
import { auth, adminOnly, delay, JWT_SECRET, AuthRequest } from './middleware';
import { User } from './types';

const app = express();
app.use(cors());
app.use(express.json());
app.use(delay);

const strip = ({ passwordHash, ...rest }: User) => rest;

// ---- Auth ----
app.post('/api/login', (req, res) => {
  const { userId, password, role } = req.body;
  const user = loadUsers().find(u => u.userId === userId && u.role === role);
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(401).json({ message: 'Invalid credentials or role' });
  }
  const token = jwt.sign({ id: user.id, userId: user.userId, role: user.role }, JWT_SECRET, { expiresIn: '2h' });
  res.json({ token, user: strip(user) });
});

app.get('/api/me', auth, (req: AuthRequest, res) => {
  const user = loadUsers().find(u => u.id === req.user!.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(strip(user));
});

// ---- Records (filtered by access level) ----
const records = [
  { id: 1, title: 'Company Handbook', owner: 'HR', accessLevel: 'Public' },
  { id: 2, title: 'Holiday Calendar', owner: 'HR', accessLevel: 'Public' },
  { id: 3, title: 'Team Roadmap', owner: 'Product', accessLevel: 'Internal' },
  { id: 4, title: 'Sprint Report', owner: 'Engineering', accessLevel: 'Internal' },
  { id: 5, title: 'Salary Structure', owner: 'Finance', accessLevel: 'Confidential' },
  { id: 6, title: 'Audit Findings', owner: 'Finance', accessLevel: 'Confidential' },
];

app.get('/api/records', auth, (req: AuthRequest, res) => {
  const allowed = req.user!.role === 'Admin'
    ? ['Public', 'Internal', 'Confidential']
    : ['Public', 'Internal'];
  res.json(records.filter(r => allowed.includes(r.accessLevel)));
});

// ---- User management (Admin only) ----
app.get('/api/users', auth, adminOnly, (_req, res) => {
  res.json(loadUsers().map(strip));
});

app.post('/api/users', auth, adminOnly, (req, res) => {
  const { userId, name, email, password, role } = req.body;
  const users = loadUsers();
  if (users.some(u => u.userId === userId)) return res.status(409).json({ message: 'User ID already exists' });
  const newUser: User = {
    id: Math.max(0, ...users.map(u => u.id)) + 1,
    userId, name, email, role,
    passwordHash: bcrypt.hashSync(password, 10),
  };
  users.push(newUser);
  saveUsers(users);
  res.status(201).json(strip(newUser));
});

app.put('/api/users/:id', auth, adminOnly, (req, res) => {
  const users = loadUsers();
  const user = users.find(u => u.id === Number(req.params.id));
  if (!user) return res.status(404).json({ message: 'User not found' });
  const { name, email, role, password } = req.body;
  Object.assign(user, { name: name ?? user.name, email: email ?? user.email, role: role ?? user.role });
  if (password) user.passwordHash = bcrypt.hashSync(password, 10);
  saveUsers(users);
  res.json(strip(user));
});

app.delete('/api/users/:id', auth, adminOnly, (req: AuthRequest, res) => {
  const id = Number(req.params.id);
  if (id === req.user!.id) return res.status(400).json({ message: 'You cannot delete yourself' });
  const users = loadUsers();
  if (!users.some(u => u.id === id)) return res.status(404).json({ message: 'User not found' });
  saveUsers(users.filter(u => u.id !== id));
  res.status(204).send();
});

app.listen(3000, () => console.log('API running on http://localhost:3000'));