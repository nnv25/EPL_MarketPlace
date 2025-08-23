import './BalanceUpdate.css';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { ShopContext } from '../../components/Context/ShopContext';
import { toast } from 'react-toastify';

const BalanceUpdate = () => {
  const { url, selectedShop, shops } = useContext(ShopContext); // Добавлено получение списка магазинов
  const [balance, setBalance] = useState('');

  // Обновляем данные магазина при выборе
  useEffect(() => {
    if (selectedShop) {
      const shop = shops.find((shop) => shop._id === selectedShop);
      if (shop) {
        setBalance(shop.balance || ''); // Устанавливаем баланс выбранного магазина
      }
    }
  }, [selectedShop, shops]);

  // Обработчик изменения баланса
  const handleChange = (e) => {
    setBalance(e.target.value);
  };

  // Обработчик отправки данных на сервер
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Проверка на заполнение данных
    if (!balance) {
      toast.error('Введите новый баланс для магазина');
      return;
    }

    try {
      // Отправка запроса на обновление баланса
      const response = await axios.post(`${url}/api/shop/update-balance`, {
        id: selectedShop,
        balance: parseFloat(balance),
      });

      if (response.data.success) {
        toast.success('Баланс магазина успешно обновлен');
      } else {
        toast.error(response.data.message || 'Ошибка при обновлении баланса магазина');
      }
    } catch (error) {
      console.error('Ошибка при обновлении баланса магазина:', error);
      toast.error('Произошла ошибка при обновлении баланса магазина');
    }
  };

  return (
    <div className="shop-details">
      {selectedShop ? (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="balance" className="shop-update-text">
              Новый баланс
            </label>
            <input
              type="number"
              id="balance"
              name="balance"
              value={balance}
              onChange={handleChange}
              className="balance-input"
              placeholder="Введите новый баланс"
            />
          </div>
          <button type="submit" className="update-button">
            Обновить баланс
          </button>
        </form>
      ) : (
        <p>Выберите магазин из списка</p>
      )}
    </div>
  );
};

export default BalanceUpdate;