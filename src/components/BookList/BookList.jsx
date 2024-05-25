import React from 'react';
import styles from './BookList.module.css';

const BookList = ({ books, deleteBook }) => {
  return (
    <div className={styles.list}>
      {books.map((book) => (
        <div key={book.id || book._id} className={styles.book}>
          <h2>{book.title}</h2>
          <p>{book.author}</p>
          <button onClick={() => deleteBook(book.id || book._id)}>Видалити</button>
        </div>
      ))}
    </div>
  );
};

export default BookList;
