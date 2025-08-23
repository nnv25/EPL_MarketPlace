{/*import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import "./OTPinput.css";
import { StoreContext } from "../Context/StoreContext";
import NewPassword from "../NewPassword/NewPassword";

const OTPinput = () => {
  const { email } = useContext(StoreContext);
  const [timer, setTimer] = useState(300);
  const [disable, setDisable] = useState(true);
  const [OTPinput, setOTPinput] = useState(new Array(4).fill(""));
  const [showNewPassword, setShowNewPassword] = useState(false);
  const inputRefs = useRef(new Array(4).fill(null));

  async function resendOTP() {
    if (disable) return;
  
    try {
      const response = await axios.post(
        "http://localhost:4000/api/user/request-password-reset",
        { email }
      );
      console.log("OTP отправлен повторно:", response.data);
  
      setDisable(true);
      setTimer(300);
    } catch (error) {
      console.error("Ошибка при отправке OTP:", error);
    }
  }
  
  async function verifyOTP() {
    const otpValue = OTPinput.join("");
    console.log("Введенный OTP:", otpValue);
  
    try {
      const response = await axios.post("http://localhost:4000/api/user/verify-otp", {
        email,
        OTP: otpValue
      });
  
      console.log("Результат проверки OTP:", response.data);
  
      if (response.data.success) {
        setShowNewPassword(true); // Показать компонент смены пароля
      } else {
        alert(response.data.message || "Неверный код. Попробуйте снова или запросите новый код.");
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

      // Перемещение фокуса на следующий input, если это не последний
      if (index < 3 && value !== "") {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOTP = [...OTPinput];
      newOTP[index] = ""; // Очищаем текущее поле при нажатии Backspace
      setOTPinput(newOTP);

      // Перемещаем фокус на предыдущий input при удалении
      if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  return (
    <div className="verification-container">
      {showNewPassword ? (
        <NewPassword /> 
      ) : (
        <div className="verification-box">
          <div className="verification-content">
            <div className="verification-header">
              <h2>Подтверждение электронной почты</h2>
              <p className="verification-description">
                Мы отправили код на вашу почту {email}
              </p>
            </div>
            <form>
              <div className="otp-input-container">
                {OTPinput.map((_, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)} // Привязка рефа
                    maxLength="1"
                    className="otp-input"
                    type="text"
                    value={OTPinput[index]}
                    onChange={(e) => handleInputChange(e, index)} // Обработка изменения
                    onKeyDown={(e) => handleKeyDown(e, index)} // Обработка нажатий клавиш
                  />
                ))}
              </div>

              <div className="verification-actions">
                <button type="button" onClick={verifyOTP} className="verify-btn">
                  Подтвердить
                </button>

                <p className="resend-text">
                  Не получили код?{" "}
                  <a
                    onClick={resendOTP}
                    className={disable ? "resend-disabled" : "resend-enabled"}
                    style={{ cursor: disable ? "not-allowed" : "pointer" }}
                  >
                    {disable ? `Код будет повторен через ${timer}s` : "Направить повторно"}
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OTPinput;*/}
/*import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import "./OTPinput.css";
import { StoreContext } from "../Context/StoreContext";
import NewPassword from "../NewPassword/NewPassword";

const OTPinput = () => {
  const { email } = useContext(StoreContext);
  const [timer, setTimer] = useState(300);
  const [disable, setDisable] = useState(true);
  const [OTPinput, setOTPinput] = useState(new Array(4).fill(""));
  const [showNewPassword, setShowNewPassword] = useState(false);
  const inputRefs = useRef(new Array(4).fill(null));

  async function resendOTP() {
    if (disable) return;

    try {
      const response = await axios.post(
        "http://localhost:4000/api/user/request-password-reset",
        { email }
      );
      console.log("OTP отправлен повторно:", response.data);

      setDisable(true);
      setTimer(300);
    } catch (error) {
      console.error("Ошибка при отправке OTP:", error);
    }
  }

  async function verifyOTP() {
    const otpValue = OTPinput.join("");
    console.log("Введенный OTP:", otpValue);

    try {
      const response = await axios.post("http://localhost:4000/api/user/verify-otp", {
        email,
        OTP: otpValue
      });

      console.log("Результат проверки OTP:", response.data);

      if (response.data.success) {
        setShowNewPassword(true); // Показать компонент смены пароля
      } else {
        alert(response.data.message || "Неверный код. Попробуйте снова или запросите новый код.");
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

      // Перемещение фокуса на следующий input, если это не последний
      if (index < 3 && value !== "") {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOTP = [...OTPinput];
      newOTP[index] = ""; // Очищаем текущее поле при нажатии Backspace
      setOTPinput(newOTP);

      // Перемещаем фокус на предыдущий input при удалении
      if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  return (
    <div className={`verification-container ${showNewPassword ? 'hidden' : ''}`}>
      {showNewPassword ? (
        <NewPassword /> 
      ) : (
        <div className="verification-box">
          <div className="verification-content">
            <div className="verification-header">
              <h2>Подтверждение электронной почты</h2>
              <p className="verification-description">
                Мы отправили код на вашу почту {email}
              </p>
            </div>
            <form>
              <div className="otp-input-container">
                {OTPinput.map((_, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)} // Привязка рефа
                    maxLength="1"
                    className="otp-input"
                    type="text"
                    value={OTPinput[index]}
                    onChange={(e) => handleInputChange(e, index)} // Обработка изменения
                    onKeyDown={(e) => handleKeyDown(e, index)} // Обработка нажатий клавиш
                  />
                ))}
              </div>

              <div className="verification-actions">
                <button type="button" onClick={verifyOTP} className="verify-btn">
                  Подтвердить
                </button>

                <p className="resend-text">
                  Не получили код?{" "}
                  <a
                    onClick={resendOTP}
                    className={disable ? "resend-disabled" : "resend-enabled"}
                    style={{ cursor: disable ? "not-allowed" : "pointer" }}
                  >
                    {disable ? `Код будет повторен через ${timer}s` : "Направить повторно"}
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OTPinput;*/
/*import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { StoreContext } from "../Context/StoreContext";
import "./OTPinput.css";

const OTPinput = ({ phone, onClose }) => {
  const { url, setToken } = useContext(StoreContext);
  const [timer, setTimer] = useState(300);
  const [disable, setDisable] = useState(true);
  const [OTPinput, setOTPinput] = useState(new Array(4).fill(""));
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

  /*async function verifyOTP() {
    const otpValue = OTPinput.join(""); 
    const formattedPhone = formatPhoneNumber(phone.trim());
    console.log("Отправка OTP:", { phone: formattedPhone, OTP: otpValue });

    try {
      const response = await axios.post(`${url}/api/user/verify-otp`, {
        phone: formattedPhone,
        OTP: otpValue,
      });
      console.log("Ответ сервера:", response.data);
      if (response.data.success) {
        setToken(response.data.token); 
        localStorage.setItem("token", response.data.token); 
        alert("Регистрация подтверждена!");
        onClose();
      } else {
        alert("Неверный код. Повторите ввод."); 
      }
    } catch (error) {
      console.error("Ошибка при проверке OTP:", error);
      alert("Произошла ошибка при проверке OTP."); 
    }
  }*/
  /*async function verifyOTP() {
    const otpValue = OTPinput.join("");
    const formattedPhone = formatPhoneNumber(phone.trim());
    console.log("Отправка OTP:", { phone: formattedPhone, OTP: otpValue });

    try {
      const response = await axios.post(`${url}/api/user/verify-otp`, {
        phone: formattedPhone,
        OTP: otpValue,
      });
      console.log("Ответ сервера:", response.data);

      if (response.data.success) {
        const { token } = response.data;

        // Сохраняем токен и логиним пользователя
        setToken(token);
        localStorage.setItem("token", token);

        alert("Регистрация подтверждена и выполнен вход!");
        onClose(); // Закрываем модальное окно

        // Перенаправление при необходимости
        // Например: navigate("/home");
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

  return (
    <div className="modal-overlay">
      <div className="modal-content">
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
        <button className="verify-btn" onClick={verifyOTP}>Подтвердить</button>
        <button className="resend-btn" onClick={resendOTP} disabled={disable}>
          {disable ? `Отправить повторно через ${formatTime(timer)}` : "Отправить повторно"}
        </button>
        <button className="close-btn" onClick={onClose}>Закрыть</button>
      </div>
    </div>
  );
};

export default OTPinput;*/
import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { StoreContext } from "../Context/StoreContext";
import "./OTPinput.css";

const OTPinput = ({ phone, onClose }) => {
  const { url, setToken } = useContext(StoreContext);
  const [timer, setTimer] = useState(300);
  const [disable, setDisable] = useState(true);
  const [OTPinput, setOTPinput] = useState(new Array(4).fill(""));
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
      const response = await axios.post(`${url}/api/user/verify-otp`, {
        phone: formattedPhone,
        OTP: otpValue,
      });

      if (response.data.success) {
        const { token } = response.data;

        // Сохраняем токен и логиним пользователя
        setToken(token);
        localStorage.setItem("token", token);

        alert("Регистрация подтверждена и выполнен вход!");
        onClose(); // Закрываем модальное окно после успешного подтверждения
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

  return (
    <div className="modal-overlay">
      <div className="modal-content">
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
        <button className="verify-btn" onClick={verifyOTP}>Подтвердить</button>
        <button className="resend-btn" onClick={resendOTP} disabled={disable}>
          {disable ? `Отправить повторно через ${formatTime(timer)}` : "Отправить повторно"}
        </button>
        <button className="close-btn" onClick={onClose}>Закрыть</button>
      </div>
    </div>
  );
};

export default OTPinput;