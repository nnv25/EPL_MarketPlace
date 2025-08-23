import { useContext, useEffect, useState } from 'react';
import './Orders.css';
import { ShopContext } from '../../components/Context/ShopContext';
import axios from 'axios';
import { assets } from '../../assets/assets';
import PageSelector from '../../components/PageSelector/PageSelector';
import { Link } from 'react-router-dom';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(""); // Состояние для ошибки
  const [currentPage, setCurrentPage] = useState(1); // Текущая страница
  const [totalPages, setTotalPages] = useState(1); // Общее количество страниц

  const { selectedShop, url } = useContext(ShopContext);

  const fetchOrders = async (shopId, page) => {
    try {
      setLoading(true);
      setErrorMessage(""); // Очищаем ошибку перед новым запросом
      const response = await axios.get(`${url}/api/order/shop/${shopId}/orders?page=${page}&limit=7`); // Запрос с пагинацией
      if (response.data.success) {
        const sortedOrders = response.data.data.sort((a, b) => new Date(b.date) - new Date(a.date)); // Сортируем по дате
        setOrders(sortedOrders);
        setTotalPages(response.data.totalPages); // Устанавливаем общее количество страниц
      } else {
        setErrorMessage(response.data.message || "Не удалось загрузить заказы");
        setOrders([]); // Очищаем заказы, если их нет
      }
    } catch (error) {
      setErrorMessage("Ошибка подключения к серверу");
    } finally {
      setLoading(false);
    }
  };

  const statusHandler = async (event, orderId, userId, shop) => {
    const response = await axios.post(`${url}/api/order/status`, {
      orderId,
      status: event.target.value,
      userId,
      shop
    });
    if (response.data.success) {
      await fetchOrders(selectedShop, currentPage);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}.${month}.${year} ${hours}:${minutes}`;
  };

  useEffect(() => {
    if (selectedShop) {
      fetchOrders(selectedShop, currentPage);
    }
  }, [selectedShop, currentPage]); // Добавляем currentPage в зависимости

  if (loading) {
    return <p>Загрузка...</p>;
  }

  if (errorMessage) {
    return <p>{errorMessage}</p>; // Отображаем сообщение об ошибке
  }

  if (orders.length === 0) {
    return <p>Заказов нет для выбранного магазина.</p>;
  }

  const handlePageChange = (page) => {
    setCurrentPage(page); // Обновляем текущую страницу
  };
  
  return (
    <div className='order add'>
      <h3>Страница заказов</h3>
      <div className="order-list">
        {orders.map((order, index) => (
          <div key={index} className='order-item'>
            <img src={assets.parcel_icon} alt="" />
            <div>
              <p className="order-item-flower">
                {order.items.map((item, index) => {
                  // Ограничиваем длину названия товара до 20 символов и добавляем троеточие
                  const itemName = item.name.length > 10 ? `${item.name.slice(0, 6)}...` : item.name;

                  // Формируем строку вида "название товара x количество"
                  const itemText = `${itemName} x ${item.quantity}`;

                  // Для всех товаров, кроме последнего, добавляем запятую
                  if (index === order.items.length - 1) {
                    return itemText;
                  } else {
                    return itemText + ", ";
                  }
                })}
              </p>
            </div>
            {/*<p className='order-item-name'>{order.userId.name}</p>*/}
            {/*<p className="order-item-address">{order.address.address}</p>*/}
            <p className="order-item-phone">{order.userId.phone}</p>
            {/*<p>{formatDate(order.date)}</p>*/}
            <p className="order-item-price">Цена: {order.amount} ₽</p>
            <p className="order-item-delivery">Способ получения: {order.deliveryOption}</p>
            {/*<p>Комментарий: {order.comment ? order.comment : 'Отсутствует'}</p>*/}
            <select onChange={(event) => statusHandler(event, order._id, order.userId, order.shop)} value={order.status}>
              <option value="Заказ в обработке">Заказ в обработке</option>
              <option value="Заказ готов">Заказ готов</option>
              <option value="Доставка заказа">Доставка заказа</option>
              <option value="Заказ доставлен">Заказ доставлен</option>
            </select>
            <Link to={`/order-details/${order._id}`} className="order-details-link">
              <button className='order-details-button'>Детали заказа</button>
            </Link>
          </div>
        ))}
      </div>
      {/* Пагинация */}
      <PageSelector 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Orders;