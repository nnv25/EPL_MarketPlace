import React, { useEffect, useState } from 'react';
import './BalanceInformation.css';

const BalanceInformation = ({ selectedShop }) => {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedShop) {
      const fetchBalance = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch("http://localhost:4000/api/shop/balance", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ shopId: selectedShop }),
          });

          const data = await response.json();
          if (response.ok) {
            setBalance(data.data.balance);
          } else {
            setError(data.message);
          }
        } catch (err) {
          setError("Ошибка при запросе данных.");
        } finally {
          setLoading(false);
        }
      };

      fetchBalance();
    } else {
      setBalance(null); // Сбрасываем состояние, если магазин не выбран
    }
  }, [selectedShop]);

  return (
    <div className="balance-information">
      {loading ? (
        <p>Загрузка...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : balance !== null ? (
        <p
          className={`balance-txt ${
            balance < 500 ? "low-balance" : "high-balance"
          }`}
        >
          Баланс: {balance} ₽
        </p>
      ) : (
        <p>Выберите магазин, чтобы увидеть баланс.</p>
      )}
    </div>
  );
};

export default BalanceInformation;