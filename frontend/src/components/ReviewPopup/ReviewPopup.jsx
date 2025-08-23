{/*import React, { useState } from 'react';
import axios from 'axios';
import './ReviewPopup.css';

const ReviewPopup = ({ shopId, onClose }) => {
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState('');
  const maxLength = 150;
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const token = localStorage.getItem('token');

            if (!token) {
                setErrorMessage('Ошибка: Токен не найден.');
                return;
        }

            const response = await axios.post('http://localhost:4000/api/rating/addratings', {
                shopId,
                rating: Number(rating), // Убедитесь, что это число
                comment
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 201) {
                setSuccessMessage('Рейтинг успешно добавлен!');
                onClose();
            } else {
                setErrorMessage('Ошибка: Не удалось добавить рейтинг.');
            }
        } catch (error) {
        console.error('Ошибка при добавлении рейтинга:', error.response.data); // Логируем ответ сервера
        setErrorMessage('Произошла ошибка при отправке отзыва. ' + (error.response ? error.response.data.message : ''));
        }
    };

  return (
    <div className='review-popup'>
      <form onSubmit={handleSubmit} className="review-popup-container">
        <div className="review-popup-title">
          <h2>Ваш отзыв очень важен для нас</h2>
          <button className="close-button" onClick={onClose}>X</button>
        </div>

        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}

        <label htmlFor="rating">Выберите оценку:</label>
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
        </select>

        <label htmlFor="review">Ваш отзыв:</label>
        <textarea
          id="review"
          name="review"
          rows="4"
          cols="50"
          placeholder="Напишите ваш отзыв..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={maxLength}
        />

        <button className="send-button" type="submit">Отправить</button>
      </form>
    </div>
  );
};

export default ReviewPopup;*/}
import React, { useState } from 'react';
import axios from 'axios';
import './ReviewPopup.css';

const ReviewPopup = ({ shopId, orderId, onClose }) => { // Добавлено orderId как пропс
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState('');
  const maxLength = 150;
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        setErrorMessage('Ошибка: Токен не найден.');
        return;
      }

      const response = await axios.post('http://localhost:4000/api/rating/addratings', {
        shopId,
        rating: Number(rating), // Убедитесь, что это число
        comment,
        orderId // Передаем orderId
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 201) {
        setSuccessMessage('Рейтинг успешно добавлен!');
        onClose();
      } else {
        setErrorMessage('Ошибка: Не удалось добавить рейтинг.');
      }
    } catch (error) {
      console.error('Ошибка при добавлении рейтинга:', error.response.data); // Логируем ответ сервера
      if (error.response && error.response.status === 400) {
        alert(error.response.data.message); // Выводим алерт с сообщением об ошибке
      }
      setErrorMessage('Произошла ошибка при отправке отзыва. ' + (error.response ? error.response.data.message : ''));
    }
  };

  return (
    <div className='review-popup'>
      <form onSubmit={handleSubmit} className="review-popup-container">
        <div className="review-popup-title">
          <h2>Ваш отзыв очень важен для нас</h2>
          <button className="close-button" onClick={onClose}>X</button>
        </div>

        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}

        <label htmlFor="rating">Выберите оценку:</label>
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
        </select>

        <label htmlFor="review">Ваш отзыв:</label>
        <textarea
          id="review"
          name="review"
          rows="4"
          cols="50"
          placeholder="Напишите ваш отзыв..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={maxLength}
        />

        <button className="send-button" type="submit">Отправить</button>
      </form>
    </div>
  );
};

export default ReviewPopup;
