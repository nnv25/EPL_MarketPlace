import React, { useContext, useState } from "react";
import axios from "axios";
import { StoreContext } from "../Context/StoreContext";
import './NewPassword.css';

const NewPassword = ({ phone, onClose }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { setToken } = useContext(StoreContext);

  const formatPhoneNumber = (phone) => {
    return phone.replace(/[^+\d]/g, '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedPhone = formatPhoneNumber(phone.trim());
    
    if (password !== confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }
  
    // Логируем данные, которые отправляются на сервер
    const dataToSend = {
      phone: formattedPhone,
      newPassword: password,
    };

    console.log("Отправляемые данные:", dataToSend); // Это покажет, какие данные отправляются на сервер
  
    try {
      const response = await axios.post(
        "http://localhost:4000/api/user/reset-password",
        dataToSend, // Отправляемые данные
        {
          headers: {
            "Content-Type": "application/json", // Явно указываем, что тело запроса в формате JSON
          },
        }
      );
  
      console.log("Ответ сервера:", response.data); // Покажет ответ от сервера
  
      if (response.data.success) {
        const { token } = response.data;
        setToken(token);
        localStorage.setItem("token", token);
        setSuccess("Пароль успешно сброшен");
        setError("");
        if (onClose) {
          console.log("Закрываем окно NewPassword"); // Лог для отладки
          onClose();
      }
      } else {
        setError(response.data.message || "Ошибка при сбросе пароля");
      }
    } catch (error) {
      console.error("Ошибка при сбросе пароля:", error);
      setError("Произошла ошибка при сбросе пароля");
    }
  };

  return (
    <div className="popup-container">
      <section className="reset-container">
        <div className="reset-wrapper">
          <div className="reset-box">
            <h2 className="reset-title">Изменить пароль</h2>
            <button className="close-btn1" onClick={onClose}>×</button>
            <form className="reset-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="password" className="form-label">Новый пароль</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="form-input"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirm-password" className="form-label">Подтвердить новый пароль</label>
                <input
                  type="password"
                  name="confirm-password"
                  id="confirm-password"
                  placeholder="••••••••"
                  className="form-input"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              {error && <p className="error-message">{error}</p>}
              {success && <p className="success-message">{success}</p>}
              <button type="submit" className="reset-button">Изменить пароль</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewPassword;
