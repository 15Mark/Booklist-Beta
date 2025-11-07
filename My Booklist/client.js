const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

//Get all books – Using async callback function
async function getAllBooks() {
  try {
    console.log('\n=== Task 10: Get all books (async/await) ===');
    const response = await axios.get(`${BASE_URL}/books`);
    console.log(`Found ${response.data.count} books:`);
    response.data.books.forEach(book => {
      console.log(`- ${book.title} by ${book.author} (ISBN: ${book.isbn})`);
    });
    return response.data.books;
  } catch (error) {
    console.error('Error fetching books:', error.response?.data?.error || error.message);
    throw error;
  }
}

//Search by ISBN – Using Promises
function searchByISBN(isbn) {
  console.log('\n=== Task 11: Search by ISBN (Promises) ===');
  return axios.get(`${BASE_URL}/books/isbn/${isbn}`)
    .then(response => {
      const book = response.data.book;
      console.log(`Found book: ${book.title} by ${book.author}`);
      console.log(`ISBN: ${book.isbn}, Year: ${book.year}, Genre: ${book.genre}`);
      return book;
    })
    .catch(error => {
      console.error('Error searching by ISBN:', error.response?.data?.error || error.message);
      throw error;
    });
}

// Task 12: Search by Author
async function searchByAuthor(author) {
  try {
    console.log('\n=== Task 12: Search by Author (async/await) ===');
    const encodedAuthor = encodeURIComponent(author);
    const response = await axios.get(`${BASE_URL}/books/author/${encodedAuthor}`);
    console.log(`Found ${response.data.count} books by ${author}:`);
    response.data.books.forEach(book => {
      console.log(`- ${book.title} (ISBN: ${book.isbn}, Year: ${book.year})`);
    });
    return response.data.books;
  } catch (error) {
    console.error('Error searching by author:', error.response?.data?.error || error.message);
    throw error;
  }
}

//Search by Title
async function searchByTitle(title) {
  try {
    console.log('\n=== Task 13: Search by Title (async/await) ===');
    const encodedTitle = encodeURIComponent(title);
    const response = await axios.get(`${BASE_URL}/books/title/${encodedTitle}`);
    console.log(`Found ${response.data.count} books with title containing "${title}":`);
    response.data.books.forEach(book => {
      console.log(`- ${book.title} by ${book.author} (ISBN: ${book.isbn})`);
    });
    return response.data.books;
  } catch (error) {
    console.error('Error searching by title:', error.response?.data?.error || error.message);
    throw error;
  }
}

// Example usage
async function runExamples() {
  try {
    // Task 10: Get all books
    await getAllBooks();

    // Task 11: Search by ISBN (using Promises)
    await searchByISBN('978-0-123456-78-9');

    // Task 12: Search by Author
    await searchByAuthor('F. Scott Fitzgerald');

    // Task 13: Search by Title
    await searchByTitle('Great');

    console.log('\n=== All tasks completed successfully! ===');
  } catch (error) {
    console.error('Error running examples:', error.message);
  }
}

// Run examples if this file is executed directly
if (require.main === module) {
  runExamples();
}

// Export functions for use in other modules
module.exports = {
  getAllBooks,
  searchByISBN,
  searchByAuthor,
  searchByTitle
};


