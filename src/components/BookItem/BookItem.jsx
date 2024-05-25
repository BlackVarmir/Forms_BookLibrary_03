import React from 'react';
import styles from './BookItem.module.css';

const BookItem = ({ book, deleteBook }) => {
  return (
    <li className={styles.item}>
      <span>{book.title} - {book.author}</span>
      <button onClick={() => deleteBook(book.id)}>Видалити</button>
    </li>
  );
};

export default BookItem;
