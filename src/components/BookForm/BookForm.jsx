import React, { useState } from 'react';
import styles from './BookForm.module.css';

const BookForm = ({ addBook, onClose }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() === '' || author.trim() === '') {
      alert('Усі поля мають бути заповнені');
      return;
    }
    addBook({ title, author });
    setTitle('');
    setAuthor('');
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="text"
        placeholder="Назва книги"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Автор"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />
      <button type="submit">Додати книгу</button>
    </form>
  );
};

export default BookForm;