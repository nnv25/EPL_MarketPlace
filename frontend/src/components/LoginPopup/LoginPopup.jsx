import React, { useContext, useState } from 'react';
import './Loginpopup.css';
import { assets } from '../../assets/assets_flowers';
import InputMask from "react-input-mask";
import { StoreContext } from '../Context/StoreContext';
import axios from "axios";
import EmailConfirmation from '../EmailConfirmation/EmailConfirmation';
import { useNavigate } from 'react-router-dom';
import ForgottenPassword from '../ForgottenPassword/ForgottenPassword';
import OTPinput from '../OTPinput/OTPinput';
import PhoneNumberRequest from '../PhoneNumberRequest/PhoneNumberRequest';

const LoginPopup = () => {
  const { url, setToken, setShowLogin } = useContext(StoreContext);
  const [currState, setCurrState] = useState("Зарегистрироваться");
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isOTPRequested, setIsOTPRequested] = useState(false); 
  const navigate = useNavigate();

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };


  const formatPhoneNumber = (phone) => {
    const digits = phone.replace(/\D/g, ""); 
    return `+7${digits.slice(-10)}`;
  };

  const onLogin = async (event) => {
    event.preventDefault();

    let formattedPhone = formatPhoneNumber(data.phone);
    let newData = { ...data, phone: formattedPhone };

    let newUrl = url;
    if (currState === "Зарегистрироваться") {
      newUrl += "/api/user/register";
    } else {
      newUrl += "/api/user/login";
    }

    try {
      const response = await axios.post(newUrl, newData);
      if (response.data.success) {
        if (currState === "Зарегистрироваться") {
          setToken(response.data.token); 
          localStorage.setItem("token", response.data.token);
          setIsOTPRequested(true);
        } else {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token); 
          setShowLogin(false);
        }
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error during request:', error);
    }
  };

  const handleCloseModal = () => {
    setIsOTPRequested(false); 
    setShowLogin(false);
  };

  /*if (isRegistered) {
    return <EmailConfirmation setShowLogin={setShowLogin} />;
  }*/

  if (showForgotPassword) {
    return <PhoneNumberRequest onClose={handleCloseModal}/>;//новое
  }

return (
  <div className="login-popup">
    {!isOTPRequested ? ( // Условный рендеринг формы регистрации/входа
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
        </div>
        <div className="login-popup-inputs">
          {currState === "Зарегистрироваться" ? (
            <input
              name="name"
              onChange={onChangeHandler}
              value={data.name}
              type="text"
              placeholder="Ваше имя"
              required
            />
          ) : null}
          {currState === "Зарегистрироваться" ? (
            <input
              type="email"
              name="email"
              onChange={onChangeHandler}
              value={data.email}
              placeholder="Электронная почта"
              required
            />
          ) : null}
          <InputMask
            name="phone"
            onChange={onChangeHandler}
            value={data.phone}
            mask="+7(999)999-99-99"
            placeholder="Номер телефона"
            required
          />
          <input
            type="password"
            name="password"
            onChange={onChangeHandler}
            value={data.password}
            placeholder="Пароль"
            required
          />
          
        </div>
        <button type="submit">
          {currState === "Зарегистрироваться" ? "Зарегистрироваться" : "Войти в аккаунт"}
        </button>
        <div className="login-popup-condition">
          {currState === "Зарегистрироваться" ? (
            <div>
              <input type="checkbox" required />
              <p>
                Нажимая на "Зарегистрироваться" я принимаю Пользовательское соглашение и Политику
                конфиденциальности, а также даю согласие на обработку моих персональных данных
              </p>
            </div>
          ) : null}
          {currState !== "Зарегистрироваться" ? (
            <>
              <p>
                Забыли пароль? <span onClick={() => setShowForgotPassword(true)}>Нажмите тут</span>
              </p>
              <p>
                Создать новый аккаунт?{" "}
                <span onClick={() => setCurrState("Зарегистрироваться")}>Нажмите тут</span>
              </p>
            </>
          ) : (
            <p>
              Уже есть аккаунт? <span onClick={() => setCurrState("Войти")}>Войти</span>
            </p>
          )}
        </div>
      </form>
    ) : (
      <OTPinput phone={data.phone} onClose={handleCloseModal} />
    )}
  </div>
);
}

export default LoginPopup;
/*import React, { useContext, useState } from 'react';
import './Loginpopup.css';
import InputMask from "react-input-mask";
import { StoreContext } from '../Context/StoreContext';
import axios from "axios";
import OTPinput from '../OTPinput/OTPinput';

const LoginPopup = () => {
  const { url, setShowLogin } = useContext(StoreContext);
  const [currState, setCurrState] = useState("Зарегистрироваться");
  const [data, setData] = useState({
    name: "",
    email: "", // Добавлено поле для email
    phone: "",
    password: "",
  });
  const [isOTPRequested, setIsOTPRequested] = useState(false); // Для отображения OTP-поля

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const formatPhoneNumber = (phone) => {
    // Убираем все, кроме цифр
    const digits = phone.replace(/\D/g, "");
    // Формируем номер в формате +7XXXXXXXXXX
    return `+7${digits.slice(-10)}`; // Берем последние 10 цифр после кода страны
  };

  const onRequestOTP = async (event) => {
    event.preventDefault();
    
    // Форматируем номер телефона перед отправкой
    const formattedPhone = formatPhoneNumber(data.phone);

    try {
      const response = await axios.post(`${url}/api/user/register`, { 
        name: data.name, 
        email: data.email,
        phone: formattedPhone, // Отправляем отформатированный номер
        password: data.password,
      });
      if (response.data.success) {
        setIsOTPRequested(true); // Отобразить компонент для ввода OTP
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Ошибка при запросе OTP:', error);
      alert('Произошла ошибка при запросе OTP.');
    }
  };

  return (
    <div className="login-popup">
      {!isOTPRequested ? (
        <form onSubmit={onRequestOTP} className="login-popup-container">
          <h2>{currState}</h2>
          <input
            type="text"
            name="name"
            onChange={onChangeHandler}
            value={data.name}
            placeholder="Ваше имя"
            required
          />
          <input
            type="email" // Поле для ввода email
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            placeholder="Ваш email"
            required
          />
          <InputMask
            name="phone"
            onChange={onChangeHandler}
            value={data.phone}
            mask="+7(999)999-99-99"
            placeholder="Номер телефона"
            required
          />
          <input
            type="password"
            name="password"
            onChange={onChangeHandler}
            value={data.password}
            placeholder="Пароль"
            required
          />
          <button type="submit">
            {currState === "Зарегистрироваться" ? "Запросить OTP" : "Войти"}
          </button>
        </form>
      ) : (
        <OTPinput phone={data.phone} /> // Компонент для ввода OTP
      )}
    </div>
  );
};

export default LoginPopup;*/
/*import React, { useContext, useState } from 'react';
import './Loginpopup.css';
import InputMask from "react-input-mask";
import { StoreContext } from '../Context/StoreContext';
import axios from "axios";
import OTPinput from '../OTPinput/OTPinput';

const LoginPopup = () => {
  const { url, setShowLogin } = useContext(StoreContext);
  const [currState, setCurrState] = useState("Зарегистрироваться");
  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [isOTPRequested, setIsOTPRequested] = useState(false); 

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const formatPhoneNumber = (phone) => {
    const digits = phone.replace(/\D/g, "");
    return `+7${digits.slice(-10)}`; 
  };

  const onRequestOTP = async (event) => {
    event.preventDefault();
    
    const formattedPhone = formatPhoneNumber(data.phone);

    try {
      const response = await axios.post(`${url}/api/user/register`, { 
        name: data.name, 
        email: data.email,
        phone: formattedPhone,
        password: data.password,
      });
      if (response.data.success) {
        setIsOTPRequested(true); 
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Ошибка при запросе OTP:', error);
      alert('Произошла ошибка при запросе OTP.');
    }
  };

  const handleCloseModal = () => {
    setIsOTPRequested(false);
    setShowLogin(false); // Закрываем модальное окно
  };

  return (
    <div className="login-popup">
      {!isOTPRequested ? (
        <form onSubmit={onRequestOTP} className="login-popup-container">
          <h2 className='login-popup-title'>{currState}</h2>
          <input
            className='login-popup-inputs'
            type="text"
            name="name"
            onChange={onChangeHandler}
            value={data.name}
            placeholder="Ваше имя"
            required
          />
          <input
            className='login-popup-inputs'
            type="email"
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            placeholder="Ваш email"
            required
          />
          <InputMask
            className='login-popup-inputs'
            name="phone"
            onChange={onChangeHandler}
            value={data.phone}
            mask="+7(999)999-99-99"
            placeholder="Номер телефона"
            required
          />
          <input
            className='login-popup-inputs'
            type="password"
            name="password"
            onChange={onChangeHandler}
            value={data.password}
            placeholder="Пароль"
            required
          />
          <button type="submit">
            {currState === "Зарегистрироваться" ? "Зарегистрироваться" : "Войти"}
          </button>
        </form>
      ) : (
        <OTPinput phone={data.phone} onClose={handleCloseModal} /> // Передаем onClose
      )}
    </div>
  );
};

export default LoginPopup;*/