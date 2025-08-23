import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ReviewPopup.css';

const ReviewPopup = ({ shopId, orderId, ratingId, onClose }) => {
  const [ratingData, setRatingData] = useState(null);
  const [storeComment, setStoreComment] = useState('');
  const maxLength = 150;
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch the review data when component mounts
  useEffect(() => {
    const fetchRatingData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:4000/api/rating/listrating/${ratingId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRatingData(response.data.data[0]); // Assuming API returns data array with one item
      } catch (error) {
        setErrorMessage('Ошибка при получении данных отзыва');
      }
    };
    fetchRatingData();
  }, [ratingId]);

  // Handle submitting the store comment
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

      await axios.put(`http://localhost:4000/api/rating/update/${ratingId}`, 
        { storeComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccessMessage('Комментарий успешно добавлен.');
      onClose();
    } catch (error) {
      setErrorMessage('Ошибка при добавлении комментария.');
    }
  };

  return (
    <div className='review-popup'>
      <form onSubmit={handleSubmit} className="review-popup-container">
        <div className="review-popup-title">
          <h2>Отзыв</h2>
          <button className="close-button" onClick={onClose}>X</button>
        </div>
        {ratingData ? (
          <>
            <p>{ratingData.userId.name}</p>
            <p>Рейтинг: {ratingData.rating}</p>
            <p>Комментарий: {ratingData.comment || 'Отзыв отсутствует'}</p>
            <textarea
              maxLength={maxLength}
              placeholder="Добавить комментарий магазина"
              value={storeComment}
              onChange={(e) => setStoreComment(e.target.value)}
              className="store-comment-textarea"
            ></textarea>
            <button className="send-button" type="submit">Отправить</button>
            {successMessage && <p className="success-message">{successMessage}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </>
        ) : (
          <p>Загрузка...</p>
        )}
      </form>
    </div>
  );
};

export default ReviewPopup;
