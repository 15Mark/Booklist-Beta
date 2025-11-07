# My Booklist - Book Shop Application

A comprehensive book management application with user authentication and review system.

## Features

### General Users (Tasks 1-7)
- Get the book list available in the shop
- Get books based on ISBN
- Get all books by Author
- Get all books based on Title
- Get book Review
- Register New user
- Login as a Registered user

### Registered Users (Tasks 8-9)
- Add/Modify a book review
- Delete book review added by that particular user

### Node.js Client Methods (Tasks 10-13)
- Get all books – Using async/await
- Search by ISBN – Using Promises
- Search by Author – Using async/await
- Search by Title – Using async/await

## Installation

1. Install dependencies:
```bash
npm install
```

## Running the Application

1. Start the server:
```bash
npm start
```

The server will run on `http://localhost:3000`

2. Open your browser and navigate to `http://localhost:3000` to access the web interface.

3. To run the Node.js client examples (Tasks 10-13):
```bash
npm run client
```

Or use the client module in your own code:
```javascript
const { getAllBooks, searchByISBN, searchByAuthor, searchByTitle } = require('./client');

// Example usage
async function example() {
  await getAllBooks();
  await searchByISBN('978-0-123456-78-9');
  await searchByAuthor('F. Scott Fitzgerald');
  await searchByTitle('Great');
}
```

## API Endpoints

### General Endpoints (No Authentication Required)

- `GET /api/books` - Get all books
- `GET /api/books/isbn/:isbn` - Get book by ISBN
- `GET /api/books/author/:author` - Get books by author
- `GET /api/books/title/:title` - Get books by title
- `GET /api/reviews/:isbn` - Get reviews for a book
- `POST /api/register` - Register a new user
- `POST /api/login` - Login and get JWT token

### Protected Endpoints (Authentication Required)

Include the JWT token in the Authorization header: `Bearer <token>`

- `POST /api/reviews` - Add or modify a book review
- `DELETE /api/reviews/:isbn` - Delete your review for a book

## Technology Stack

- **Backend**: Node.js with Express
- **Authentication**: JWT (JSON Web Tokens) with bcrypt for password hashing
- **HTTP Client**: Axios for Node.js client methods
- **Storage**: JSON files (can be easily migrated to a database)
- **Frontend**: Vanilla JavaScript with modern CSS

## Project Structure

```
My Booklist/
├── server.js          # Express server with all API endpoints
├── client.js          # Node.js client methods (Tasks 10-13)
├── package.json       # Dependencies and scripts
├── public/
│   └── index.html     # Web interface
├── data/              # Data storage (created automatically)
│   ├── books.json     # Book catalog
│   ├── users.json     # User accounts
│   └── reviews.json   # Book reviews
└── README.md          # This file
```

## Usage Examples

### Using the Web Interface

1. **Register a new user**: Fill in username, email, and password, then click "Register"
2. **Login**: Enter your credentials and click "Login"
3. **Search books**: Use the search buttons to find books by ISBN, author, or title
4. **View reviews**: Enter an ISBN and click "Get Book Reviews"
5. **Add/Modify review**: After logging in, fill in the review form and submit
6. **Delete review**: Enter the ISBN and click "Delete My Review"

### Using the Node.js Client

The `client.js` file exports four functions that demonstrate async/await and Promises:

```javascript
const client = require('./client');

// All use async/await except searchByISBN which uses Promises
await client.getAllBooks();
await client.searchByISBN('978-0-123456-78-9');
await client.searchByAuthor('F. Scott Fitzgerald');
await client.searchByTitle('Great');
```

## Default Books

The application comes with 5 sample books:
- The Great Gatsby by F. Scott Fitzgerald
- To Kill a Mockingbird by Harper Lee
- 1984 by George Orwell
- Pride and Prejudice by Jane Austen
- The Catcher in the Rye by J.D. Salinger

## Notes

- Passwords are hashed using bcrypt before storage
- JWT tokens expire after 24 hours
- All data is stored in JSON files in the `data/` directory
- The server automatically creates the data directory and initializes sample data on first run

