import React, { useContext, useState } from 'react';
import './Balance.css';
import { ShopContext } from '../../components/Context/ShopContext'; // Импортируем контекст

const Balance = () => {
  const { selectedShop } = useContext(ShopContext); // Извлекаем selectedShop из контекста
  const [amount, setAmount] = useState(''); // Состояние для суммы пополнения
  const [message, setMessage] = useState(''); // Сообщение об успешной/ошибочной операции

  // Выводим shopId в консоль
  console.log("Selected Shop ID:", selectedShop);

  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedShop) {
      setMessage("Пожалуйста, выберите магазин.");
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/shop/replenish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: parseFloat(amount), Id: selectedShop }), // Используем selectedShop
      });

      if (response.ok) {
        const result = await response.json();

        if (result.success) {
          setMessage("Перенаправляем на Юкассу для подтверждения...");
          // Перенаправляем пользователя на URL подтверждения
          window.location.href = result.url;
        } else {
          setMessage(result.message || "Ошибка при пополнении баланса.");
        }
      } else {
        setMessage("Ошибка при пополнении баланса.");
      }
    } catch (error) {
      console.error("Ошибка при запросе:", error);
      setMessage("Ошибка при соединении с сервером.");
    }
  };

  return (
    <div className="balance-replenish">
      <h2>Пополнение баланса магазина</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="amount">Сумма пополнения:</label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Введите сумму"
          required
        />
        <button type="submit">Пополнить</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default Balance;