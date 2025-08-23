import { useParams } from 'react-router-dom'; // Для получения параметра из URL
import { useState, useEffect } from 'react';
import axios from 'axios';
import './OrderDetails.css';

const OrderDetails = () => {
  const { orderId } = useParams(); // Получаем id заказа из URL
  const [order, setOrder] = useState(null);

  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/order/${orderId}`);
      if (response.data.success) {
        setOrder(response.data.data);
      }
    } catch (error) {
      console.error("Ошибка получения данных о заказе", error);
    }
  };

  useEffect(() => {
    fetchOrderDetails(); // Загружаем данные при монтировании компонента
  }, [orderId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}.${month}.${year} ${hours}:${minutes}`;
  };

  if (!order) {
    return <p>Загрузка данных о заказе...</p>;
  }

  return (
    <div className="order-details">
      <h2 className="order-details-h2">Детали заказа</h2>
      <div className="order-summary">
        <div className="order-details-items">
          {order.items.map((item, index) => (
            <div key={index} className="order-details-item">
              <img src={`http://localhost:4000/flower-images/${item.images[0]}`} alt={item.name} className="order-item-image" />
              <div className="order-item-details">
                <h3 className="order-details-h3">{item.name}</h3>
                <p className="order-details-desc">Количество: {item.quantity}</p>
                <p className="order-details-desc">Цена: {item.price} ₽</p>
              </div>
            </div>
          ))}
        </div>
        <div className="order-info">
          <h3 className="order-details-h3">Информация о заказе</h3>
          <p><strong className='order-info-txt'>Имя заказчика:</strong> {order.address.firstName}</p>
          <p className='order-info-txt'><strong>Адрес:</strong> {order.address.address}</p>
          <p className='order-info-txt'><strong>Телефон:</strong> {order.address.phone}</p>
          <p className='order-info-txt'><strong>Дата заказа:</strong> {formatDate(order.date)}</p>
          <p className='order-info-txt'><strong>Способ получения:</strong> {order.deliveryOption}</p>
          <p className='order-info-txt'><strong>Способ оплаты:</strong> {order.payment}</p>
          <p className='order-info-txt'><strong>Комментарий:</strong> {order.comment || 'Отсутствует'}</p>
          <p className='order-info-txt'><strong>Общая сумма:</strong> {order.amount} ₽</p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;