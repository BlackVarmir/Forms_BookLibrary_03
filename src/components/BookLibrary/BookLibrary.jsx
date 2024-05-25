import React, { useState, useEffect } from 'react';
import BookForm from '../BookForm/BookForm';
import BookList from '../BookList/BookList';
import styles from './BookLibrary.module.css';

const BookLibrary = () => {
    const [books, setBooks] = useState([]);
    const [filter, setFilter] = useState('');
  
    useEffect(() => {
      fetchBooks();
    }, []);
  
    const fetchBooks = async () => {
      const response = await fetch('http://localhost:5000/books');
      const data = await response.json();
      setBooks(data);
    };
  
    const addBook = async (book) => {
      const response = await fetch('http://localhost:5000/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(book),
      });
      const newBook = await response.json();
      setBooks((prevBooks) => {
        const bookExists = prevBooks.find(
          (b) => b.title === newBook.title && b.author === newBook.author
        );
        if (bookExists) {
          return prevBooks;
        }
        return [...prevBooks, newBook];
      });
    };
  
    const deleteBook = async (id) => {
      await fetch(`http://localhost:5000/books/${id}`, {
        method: 'DELETE',
      });
      setBooks(books.filter((book) => book.id !== id));
    };
  
    const filteredBooks = books.filter((book) =>
      book.title.toLowerCase().includes(filter.toLowerCase())
    );
  
    return (
      <div className={styles.library}>
        <h1>Бібліотека книг</h1>
        <BookForm addBook={addBook} />
        <input
          type="text"
          placeholder="Фільтрувати книги"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <BookList books={filteredBooks} deleteBook={deleteBook} />
      </div>
    );
  };
  
  export default BookLibrary;