import express from 'express';
import mongoose from 'mongoose';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Підключення до SQLite
const sqliteDbPromise = open({
  filename: './database.sqlite',
  driver: sqlite3.Database,
});

const initializeSqliteDatabase = async () => {
  const db = await sqliteDbPromise;
  await db.exec(`
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT NOT NULL
    );
  `);
};

// Модель для MongoDB
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
});

const Book = mongoose.model('Book', bookSchema);

// Функція для перевірки підключення до MongoDB
const checkMongoConnection = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/booklibrary', { useNewUrlParser: true, useUnifiedTopology: true });
    return true;
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    return false;
  }
};

// Маршрути для MongoDB
const mongoRoutes = (app) => {
  app.post('/books', async (req, res) => {
    const { title, author } = req.body;
    let book = await Book.findOne({ title, author });

    if (!book) {
      book = new Book({ title, author });
      await book.save();
      res.status(201).json(book);
    } else {
      res.status(200).json(book);
    }
  });

  app.get('/books', async (req, res) => {
    const books = await Book.find();
    res.status(200).json(books);
  });

  app.delete('/books/:id', async (req, res) => {
    const { id } = req.params;
    await Book.findByIdAndDelete(id);
    res.status(204).send();
  });
};

// Маршрути для SQLite
const sqliteRoutes = (app) => {
  app.post('/books', async (req, res) => {
    const { title, author } = req.body;
    const db = await sqliteDbPromise;
    const book = await db.get('SELECT * FROM books WHERE title = ? AND author = ?', [title, author]);

    if (!book) {
      const result = await db.run('INSERT INTO books (title, author) VALUES (?, ?)', [title, author]);
      const newBook = await db.get('SELECT * FROM books WHERE id = ?', [result.lastID]);
      res.status(201).json(newBook);
    } else {
      res.status(200).json(book);
    }
  });

  app.get('/books', async (req, res) => {
    const db = await sqliteDbPromise;
    const books = await db.all('SELECT * FROM books');
    res.status(200).json(books);
  });

  app.delete('/books/:id', async (req, res) => {
    const { id } = req.params;
    const db = await sqliteDbPromise;
    await db.run('DELETE FROM books WHERE id = ?', [id]);
    res.status(204).send();
  });
};

// Ініціалізація
const startServer = async () => {
  const useMongo = await checkMongoConnection();

  if (useMongo) {
    console.log('Using MongoDB');
    mongoRoutes(app);
  } else {
    console.log('Using SQLite');
    await initializeSqliteDatabase();
    sqliteRoutes(app);
  }

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
};

startServer();
