const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Data file paths
const BOOKS_FILE = path.join(__dirname, 'data', 'books.json');
const USERS_FILE = path.join(__dirname, 'data', 'users.json');
const REVIEWS_FILE = path.join(__dirname, 'data', 'reviews.json');

// Initialize data files if they don't exist
async function initializeData() {
  const dataDir = path.join(__dirname, 'data');
  try {
    await fs.mkdir(dataDir, { recursive: true });
  } catch (error) {
    // Directory might already exist
  }

  // Initialize books.json
  try {
    await fs.access(BOOKS_FILE);
  } catch {
    const initialBooks = [
      {
        isbn: "978-0-123456-78-9",
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        year: 1925,
        genre: "Fiction"
      },
      {
        isbn: "978-0-987654-32-1",
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        year: 1960,
        genre: "Fiction"
      },
      {
        isbn: "978-0-112233-44-5",
        title: "1984",
        author: "George Orwell",
        year: 1949,
        genre: "Dystopian Fiction"
      },
      {
        isbn: "978-0-556677-88-9",
        title: "Pride and Prejudice",
        author: "Jane Austen",
        year: 1813,
        genre: "Romance"
      },
      {
        isbn: "978-0-998877-66-5",
        title: "The Catcher in the Rye",
        author: "J.D. Salinger",
        year: 1951,
        genre: "Fiction"
      }
    ];
    await fs.writeFile(BOOKS_FILE, JSON.stringify(initialBooks, null, 2));
  }

  // Initialize users.json
  try {
    await fs.access(USERS_FILE);
  } catch {
    await fs.writeFile(USERS_FILE, JSON.stringify([], null, 2));
  }

  // Initialize reviews.json
  try {
    await fs.access(REVIEWS_FILE);
  } catch {
    await fs.writeFile(REVIEWS_FILE, JSON.stringify([], null, 2));
  }
}

// Helper functions to read/write data
async function readBooks() {
  try {
    const data = await fs.readFile(BOOKS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeBooks(books) {
  await fs.writeFile(BOOKS_FILE, JSON.stringify(books, null, 2));
}

async function readUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeUsers(users) {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
}

async function readReviews() {
  try {
    const data = await fs.readFile(REVIEWS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeReviews(reviews) {
  await fs.writeFile(REVIEWS_FILE, JSON.stringify(reviews, null, 2));
}

// Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

// ========== GENERAL USER ENDPOINTS ==========

// Task 1: Get the book list available in the shop
app.get('/api/books', async (req, res) => {
  try {
    const books = await readBooks();
    res.json({ success: true, books, count: books.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// Task 2: Get books based on ISBN
app.get('/api/books/isbn/:isbn', async (req, res) => {
  try {
    const books = await readBooks();
    const book = books.find(b => b.isbn === req.params.isbn);
    if (book) {
      res.json({ success: true, book });
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch book' });
  }
});

// Task 3: Get all books by Author
app.get('/api/books/author/:author', async (req, res) => {
  try {
    const books = await readBooks();
    const author = decodeURIComponent(req.params.author);
    const filteredBooks = books.filter(b => 
      b.author.toLowerCase().includes(author.toLowerCase())
    );
    res.json({ success: true, books: filteredBooks, count: filteredBooks.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch books by author' });
  }
});

// Task 4: Get all books based on Title
app.get('/api/books/title/:title', async (req, res) => {
  try {
    const books = await readBooks();
    const title = decodeURIComponent(req.params.title);
    const filteredBooks = books.filter(b => 
      b.title.toLowerCase().includes(title.toLowerCase())
    );
    res.json({ success: true, books: filteredBooks, count: filteredBooks.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch books by title' });
  }
});

// Task 5: Get book Review
app.get('/api/reviews/:isbn', async (req, res) => {
  try {
    const reviews = await readReviews();
    const bookReviews = reviews.filter(r => r.isbn === req.params.isbn);
    res.json({ success: true, reviews: bookReviews, count: bookReviews.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Task 6: Register New user
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    const users = await readUsers();
    
    // Check if user already exists
    if (users.find(u => u.username === username || u.email === email)) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    await writeUsers(users);

    res.status(201).json({ 
      success: true, 
      message: 'User registered successfully',
      user: { id: newUser.id, username: newUser.username, email: newUser.email }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Task 7: Login as a Registered user
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const users = await readUsers();
    const user = users.find(u => u.username === username);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to login' });
  }
});

// ========== REGISTERED USER ENDPOINTS ==========

// Task 8: Add/Modify a book review
app.post('/api/reviews', authenticateToken, async (req, res) => {
  try {
    const { isbn, rating, comment } = req.body;
    const userId = req.user.id;

    if (!isbn || !rating) {
      return res.status(400).json({ error: 'ISBN and rating are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Check if book exists
    const books = await readBooks();
    const book = books.find(b => b.isbn === isbn);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const reviews = await readReviews();
    
    // Check if user already has a review for this book
    const existingReviewIndex = reviews.findIndex(
      r => r.isbn === isbn && r.userId === userId
    );

    const review = {
      id: existingReviewIndex >= 0 ? reviews[existingReviewIndex].id : Date.now().toString(),
      isbn,
      userId,
      username: req.user.username,
      rating: parseInt(rating),
      comment: comment || '',
      updatedAt: new Date().toISOString()
    };

    if (existingReviewIndex >= 0) {
      // Modify existing review
      reviews[existingReviewIndex] = review;
      res.json({ success: true, message: 'Review updated successfully', review });
    } else {
      // Add new review
      reviews.push(review);
      res.status(201).json({ success: true, message: 'Review added successfully', review });
    }

    await writeReviews(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add/modify review' });
  }
});

// Task 9: Delete book review added by that particular user
app.delete('/api/reviews/:isbn', authenticateToken, async (req, res) => {
  try {
    const { isbn } = req.params;
    const userId = req.user.id;

    const reviews = await readReviews();
    const reviewIndex = reviews.findIndex(
      r => r.isbn === isbn && r.userId === userId
    );

    if (reviewIndex === -1) {
      return res.status(404).json({ error: 'Review not found' });
    }

    reviews.splice(reviewIndex, 1);
    await writeReviews(reviews);

    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
initializeData().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});

