import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { StoreContext } from "../Context/StoreContext";
import NewPassword from "../NewPassword/NewPassword";
import "./OTPPasswordReset.css";

const OTPPasswordReset = ({ phone, onClose }) => {
  const { url, setToken } = useContext(StoreContext);
  const [timer, setTimer] = useState(300);
  const [disable, setDisable] = useState(true);
  const [OTPinput, setOTPinput] = useState(new Array(4).fill(""));
  const [isPasswordResetVisible, setPasswordResetVisible] = useState(false); // Добавлено состояние
  const inputRefs = useRef([]);

  const formatPhoneNumber = (phone) => {
    return phone.replace(/[^+\d]/g, '');
  };

  async function resendOTP() {
    if (disable) return;
    try {
      await axios.post(`${url}/api/user/resend-otp`, { phone: formatPhoneNumber(phone) });
      setDisable(true);
      setTimer(300);
    } catch (error) {
      console.error("Ошибка при отправке OTP:", error);
    }
  }

  async function verifyOTP() {
    const otpValue = OTPinput.join("");
    const formattedPhone = formatPhoneNumber(phone.trim());

    try {
      const response = await axios.post(`${url}/api/user/otp-password-reset`, {
        phone: formattedPhone,
        OTP: otpValue,
      });

      if (response.data.success) {
        /*const { token } = response.data;
        setToken(token);
        localStorage.setItem("token", token);*/

        alert("OTP успешно подтвержден!");
        setPasswordResetVisible(true); // Показать компонент NewPassword
      } else {
        alert("Неверный код. Повторите ввод.");
      }
    } catch (error) {
      console.error("Ошибка при проверке OTP:", error);
      alert("Произошла ошибка при проверке OTP.");
    }
  }

  useEffect(() => {
    if (disable) {
      let interval = setInterval(() => {
        setTimer((lastTimerCount) => {
          if (lastTimerCount <= 1) {
            clearInterval(interval);
            setDisable(false);
          }
          return lastTimerCount > 0 ? lastTimerCount - 1 : 0;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [disable]);

  const handleInputChange = (e, index) => {
    const value = e.target.value;
    if (/^[0-9]$/.test(value)) {
      const newOTP = [...OTPinput];
      newOTP[index] = value;
      setOTPinput(newOTP);
      if (index < 3 && value !== "") {
        inputRefs.current[index + 1].focus();
      }
    } else if (value === "") {
      if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (OTPinput[index] === "") {
        if (index > 0) {
          inputRefs.current[index - 1].focus();
        }
      } else {
        const newOTP = [...OTPinput];
        newOTP[index] = "";
        setOTPinput(newOTP);
      }
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  const handleVerifyOTP = () => {
    verifyOTP(); // Верификация OTP
  };

  const handleClose = () => {
    // Закрытие модального окна
    onClose(); // вызываем переданную функцию
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {isPasswordResetVisible ? (
          // Показываем форму сброса пароля после успешной верификации OTP
          <NewPassword phone={phone} onClose={onClose} />
        ) : (
          <>
            <h2 className="verification-header">Подтверждение номера телефона</h2>
            <p className="verification-description">Код отправлен на {phone}</p>
            <div className="otp-input-container">
              {OTPinput.map((_, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  maxLength="1"
                  type="text"
                  className="otp-input"
                  value={OTPinput[index]}
                  onChange={(e) => handleInputChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
            </div>
            <button className="verify-btn" onClick={handleVerifyOTP}>Подтвердить</button>
            <button className="resend-btn" onClick={resendOTP} disabled={disable}>
              {disable ? `Отправить повторно через ${formatTime(timer)}` : "Отправить повторно"}
            </button>
            <button className="close-btn" onClick={handleClose}>Закрыть</button>
          </>
        )}
      </div>
    </div>
  );
};

export default OTPPasswordReset;