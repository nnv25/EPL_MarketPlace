import './Administrator.css';
import React, { useContext, useState } from 'react';
import axios from 'axios';
import { ShopContext } from '../../components/Context/ShopContext';

const Administrator = () => {
  const { shops } = useContext(ShopContext); // Получаем список магазинов из контекста
  const [login, setLogin] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedShopId, setSelectedShopId] = useState(''); // Стейт для выбранного магазина
  const [showPassword, setShowPassword] = useState(false); // Стейт для управления видимостью пароля
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:4000/api/role/shop/register', {
        login,
        email,
        password,
        shopId: selectedShopId, // Передаём ID выбранного магазина
      });

      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Ошибка при регистрации');
    }
  };

  return (
    <div className="register-shop-user">
      <h2>Регистрация модератора магазина</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Логин"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="button"
          className={`toggle-password ${showPassword ? 'active' : ''}`} // Добавляем класс active, если пароль видим
          onClick={() => setShowPassword((prev) => !prev)}
          aria-label="Переключить видимость пароля"
        >
          {/* Используем иконку или графическое представление */}
          <span className="toggle-icon">{showPassword ? '👁️' : '🙈'}</span>
        </button>
        <select
          value={selectedShopId}
          onChange={(e) => setSelectedShopId(e.target.value)} // Устанавливаем ID выбранного магазина
          required
        >
          <option value="">Выберите магазин</option>
          {shops.map(shop => (
            <option key={shop._id} value={shop._id}>
              {shop.name} {/* Предполагается, что у магазина есть поле name */}
            </option>
          ))}
        </select>

        <button type="submit">Зарегистрировать</button>
      </form>
    </div>
  );
}

export default Administrator;
