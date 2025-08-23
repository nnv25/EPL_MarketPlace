import React, { useState, useContext } from 'react';
import './ForgottenPassword.css'
import axios from 'axios';
import { assets } from '../../assets/assets_flowers';
import { StoreContext } from '../Context/StoreContext';
import OTPinput from '../OTPinput/OTPinput'; // Импортируем компонент OTPinput

const ForgottenPassword = () => {
  const { email, setEmail } = useContext(StoreContext);
  const [message, setMessage] = useState(""); // Состояние для сообщения об успехе
  const [error, setError] = useState(""); // Состояние для сообщения об ошибке
  const [showOTPModal, setShowOTPModal] = useState(false); // Состояние для отображения модального окна

  const handleRequestPasswordReset = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:4000/api/user/request-password-reset",
        { email }
      );
      if (response.data.success) {
        setMessage("Письмо для сброса пароля отправлено на вашу почту.");
        setError("");
        setShowOTPModal(true); // Открываем модальное окно
      } else {
        setError(response.data.message || "Ошибка при отправке запроса.");
        setMessage("");
      }
    } catch (err) {
      console.log(err);
      setError("Произошла ошибка при запросе сброса пароля.");
      setMessage("");
    }
  };

  return (
    <div className="login-popup">
      {showOTPModal ? (
        <OTPinput />
      ) : (
        <form
          onSubmit={handleRequestPasswordReset}
          className="login-popup-container"
        >
          <div className="login-popup-title">
            <h2>Сброс пароля</h2>
            <img
              src={assets.cross_icon}
              alt="Закрыть"
              onClick={() => setShowForgotPassword(false)}
            />
          </div>
          <input
            className="password-reset-input"
            type="email"
            name="email"
            placeholder="Введите свою электронную почту"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Сбросить пароль</button>
          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
        </form>
      )}
    </div>
  );
};

export default ForgottenPassword;