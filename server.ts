import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_store_books';

// Database Setup
const db = new Database('store.db');

// Initialize Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS novels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    price REAL NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    imageUrl TEXT,
    userId INTEGER NOT NULL,
    FOREIGN KEY(userId) REFERENCES users(id)
  );
`);

// Seed initial data if empty
const count = db.prepare('SELECT COUNT(*) as count FROM novels').get() as { count: number };
if (count.count === 0) {
  // Create a system user for seed data
  const systemPass = bcrypt.hashSync('system_pass_123', 10);
  const userResult = db.prepare('INSERT INTO users (email, password) VALUES (?, ?)').run('curator@enovel.store', systemPass);
  const sysUserId = userResult.lastInsertRowid;

  const insertNovel = db.prepare(`
    INSERT INTO novels (title, author, price, category, description, imageUrl, userId)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const initialNovels = [
    {
      title: "The Midnight Library",
      author: "Matt Haig",
      price: 24.99,
      category: "Fiction",
      description: "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.",
      imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Shadows of the Wind",
      author: "Carlos Ruiz Zafón",
      price: 29.50,
      category: "Mystery",
      description: "Barcelona, 1945: A city slowly heals from its war wounds. Daniel is taken by his father to the Cemetery of Forgotten Books, a secret library of thousands of titles.",
      imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800"
    },
    {
       title: "The Alchemist",
       author: "Paulo Coelho",
       price: 19.99,
       category: "Philosophy",
       description: "A magical story about following your dreams and listening to your heart. Santiago, a shepherd boy, travels across the Egyptian desert in search of treasure.",
       imageUrl: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&q=80&w=800"
    }
  ];

  for (const n of initialNovels) {
    insertNovel.run(n.title, n.author, n.price, n.category, n.description, n.imageUrl, sysUserId);
  }
}

app.use(express.json({ limit: '10mb' }));

// Middleware: Authenticate JWT
const authenticate = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    if (!payload || !payload.userId) {
      return res.status(401).json({ error: 'Invalid token structure' });
    }
    req.userId = Number(payload.userId);
    next();
  } catch (e) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Auth Routes
app.post('/api/signup', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const info = db.prepare('INSERT INTO users (email, password) VALUES (?, ?)').run(email, hashedPassword);
    const userId = Number(info.lastInsertRowid);
    const token = jwt.sign({ userId }, JWT_SECRET);
    res.json({ token, userId });
  } catch (e: any) {
    if (e.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: 'Server error' });
    }
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const userId = Number(user.id);
  const token = jwt.sign({ userId }, JWT_SECRET);
  res.json({ token, userId });
});

app.get('/api/me', authenticate, (req: any, res) => {
  const user = db.prepare('SELECT id, email FROM users WHERE id = ?').get(req.userId) as any;
  res.json(user);
});

// Novel Routes
// Get all novels (public)
app.get('/api/novels', (req, res) => {
  try {
    const novels = db.prepare('SELECT * FROM novels').all();
    res.json(novels);
  } catch (error) {
    console.error('Error fetching novels:', error);
    res.status(500).json({ error: 'Failed to fetch novels' });
  }
});

// Get user's own novels
app.get('/api/my-novels', authenticate, (req: any, res) => {
  try {
    const novels = db.prepare('SELECT * FROM novels WHERE userId = ?').all(req.userId);
    res.json(novels);
  } catch (error) {
    console.error('Error fetching my novels:', error);
    res.status(500).json({ error: 'Failed to fetch your novels' });
  }
});

// Get specific novel
app.get('/api/novels/:id', (req, res) => {
  try {
    const novel = db.prepare('SELECT * FROM novels WHERE id = ?').get(req.params.id);
    if (!novel) return res.status(404).json({ error: 'Novel not found' });
    res.json(novel);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create novel
app.post('/api/novels', authenticate, (req: any, res: any) => {
  const { title, author, price, category, description, imageUrl } = req.body;
  
  if (!title || !author || price === undefined || !category || !description) {
    return res.status(400).json({ error: 'Incomplete data. Title, Author, Price, Category, and Description are required.' });
  }

  const numericPrice = Number(price);
  if (isNaN(numericPrice)) {
    return res.status(400).json({ error: 'Price must be a valid number.' });
  }

  try {
    const info = db.prepare(`
      INSERT INTO novels (title, author, price, category, description, imageUrl, userId)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(title, author, numericPrice, category, description, imageUrl || '', req.userId);
    res.json({ id: info.lastInsertRowid });
  } catch (error) {
    console.error('Create error:', error);
    res.status(500).json({ error: 'Database failure' });
  }
});

// Update novel
app.put('/api/novels/:id', authenticate, (req: any, res: any) => {
  const { title, author, price, category, description, imageUrl } = req.body;
  const { id } = req.params;
  
  try {
    const novel = db.prepare('SELECT * FROM novels WHERE id = ?').get(id) as any;
    if (!novel) return res.status(404).json({ error: 'Novel not found' });
    
    // Strict ownership check
    if (Number(novel.userId) !== Number(req.userId)) {
      return res.status(403).json({ error: 'You do not have permission to edit this novel.' });
    }

    db.prepare(`
      UPDATE novels SET title = ?, author = ?, price = ?, category = ?, description = ?, imageUrl = ?
      WHERE id = ?
    `).run(title, author, price, category, description, imageUrl, id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Update failed' });
  }
});

// Delete novel
app.delete('/api/novels/:id', authenticate, (req: any, res: any) => {
  const { id } = req.params;
  try {
    const novel = db.prepare('SELECT * FROM novels WHERE id = ?').get(id) as any;
    if (!novel) return res.status(404).json({ error: 'Novel not found' });
    
    if (Number(novel.userId) !== Number(req.userId)) {
      console.warn(`User ${req.userId} attempted to delete novel ${id} owned by ${novel.userId}`);
      return res.status(403).json({ error: 'You are not the owner of this archive entry.' });
    }

    db.prepare('DELETE FROM novels WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to purge entry from archive.' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
