import React, { useState, useEffect, useContext } from 'react';  
import axios from 'axios';
import { StoreContext } from '../Context/StoreContext';
import './EmailConfirmation.css';

const EmailConfirmation = ({ setShowLogin }) => {
  const { url, setToken } = useContext(StoreContext);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const checkVerificationStatus = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      console.log('Token from localStorage:', token);
  
      if (!token) {
        throw new Error('No token found in localStorage');
      }
  
      const response = await axios.get(`${url}/api/user/check-verification`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      console.log('Response from check-verification:', response.data);
  
      if (response.data.success && response.data.isVerified) {
        setIsVerified(true);
      } else {
        setErrorMessage(response.data.message || 'Ваш email ещё не подтверждён. Пожалуйста, проверьте свою почту.');
      }
    } catch (error) {
      console.error('Error in checkVerificationStatus:', error);
      setErrorMessage('Произошла ошибка при проверке подтверждения.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Выполняем проверку статуса при монтировании
    checkVerificationStatus(); 

    // Устанавливаем интервал проверки каждые 5 секунд
    const intervalId = setInterval(checkVerificationStatus, 5000);

    // Очистка интервала при размонтировании компонента
    return () => clearInterval(intervalId);
  }, []); // Пустой массив зависимостей

  const handleContinue = () => {
    console.log('Handling continue with isVerified:', isVerified);
    if (isVerified) {
      const token = localStorage.getItem("token");
      console.log('Token from localStorage in handleContinue:', token);
      if (token) {
        setToken(token); // Устанавливаем токен в контекст
        setShowLogin(false); // Закрываем окно подтверждения и продолжаем процесс
      } else {
        console.error('No token found in localStorage');
      }
    } else {
      setErrorMessage('Пожалуйста, подтвердите вашу электронную почту.');
    }
  };

  return (
    <div className="email-confirmation">
      <div className="email-confirmation-container">
        <h2 className="email-confirmation-h2">Подтверждение аккаунта</h2>
        <p>
          На указанную Вами электронную почту отправлено уведомление. Пожалуйста, проверьте Вашу почту и возвращайтесь для завершения процедуры регистрации.
        </p>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button onClick={handleContinue} disabled={loading}>
          {loading ? 'Проверка...' : 'Продолжить'}
        </button>
      </div>
    </div>
  );
};

export default EmailConfirmation;