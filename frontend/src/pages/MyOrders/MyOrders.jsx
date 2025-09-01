import { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../components/Context/StoreContext';
import "./MyOrders.css";
import axios from 'axios';
import { assets } from '../../assets/assets_flowers';
import ReviewPopup from '../../components/ReviewPopup/ReviewPopup';
import PageSelector from '../../components/PageSelector/PageSelector';

const MyOrders = () => {
  const { url, token, getShopById } = useContext(StoreContext);
  const [data, setData] = useState([]);
  const [isReviewPopupOpen, setReviewPopupOpen] = useState(false); 
  const [currentShopId, setCurrentShopId] = useState(null); 
  const [currentOrderId, setCurrentOrderId] = useState(null); 
  const [currentPage, setCurrentPage] = useState(1); // Текущая страница
  const [totalPages, setTotalPages] = useState(1); // Общее количество страниц

  const fetchOrders = async (page = 1) => {
    try {
        const response = await axios.post(
            `${url}/api/order/userorders?page=${page}&limit=7`, 
            {}, 
            { headers: { token } }
        );

        // Заказы уже отсортированы на сервере, просто устанавливаем их
        setData(response.data.data); // Устанавливаем заказы
        setCurrentPage(response.data.currentPage);
        setTotalPages(response.data.totalPages);
    } catch (error) {
        console.error("Ошибка при получении заказов:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders(currentPage); // Загружаем заказы при наличии токена
    }
  }, [token, currentPage]);

  // Открыть модальное окно для отзыва
  const handleOpenReviewPopup = (shopId, orderId) => {
    setCurrentShopId(shopId); 
    setCurrentOrderId(orderId); 
    setReviewPopupOpen(true);
  };

  // Закрыть модальное окно
  const handleCloseReviewPopup = () => {
    setReviewPopupOpen(false);
    setCurrentShopId(null); 
    setCurrentOrderId(null); 
  };

  // Обработчик смены страницы
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Функция для форматирования даты в формат "дд.мм.гггг чч:мм"
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}.${month}.${year} ${hours}:${minutes}`;
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Заказ в обработке':
        return 'status-processing'; // Красный
      case 'Доставка заказа':
        return 'status-delivery'; // Желтый
      case 'Заказ готов':
      case 'Заказ доставлен':
        return 'status-complete'; // Зеленый
      default:
        return '';
    }
  };

  return (
    <div className="my-orders">
      <h2 className="my-orders-h2">Мои Заказы</h2>
      <hr className="shop-info-divider" />
      <div className="container">
        <div className="cart-items">
          <div className="cart-items-title2">
            <div className="cart-item-wrapper2">
              <p className="cart-items-name2">Магазин</p>
            </div>
            <div className="cart-item-wrapper2">
              <p className="cart-items-name2">Заказ</p>
            </div>
            <div className="cart-item-wrapper2">
              <p className="cart-items-name2">Цена</p>
            </div>
            <div className="cart-item-wrapper2">
              <p className="cart-items-name2">Количество</p>
            </div>
            <div className="cart-item-wrapper2">
              <p className="cart-items-name2">Комментарий</p>
            </div>
            <div className="cart-item-wrapper2">
              <p className="cart-items-name2">Дата</p>
            </div>
            <div className="cart-item-wrapper2">
              <p className="cart-items-name2">Статус</p>
            </div>
            <div className="cart-item-wrapper2">
              <p className="cart-items-name2">Отзыв</p>
            </div>
          </div>
          <br />
          {data.map((order, index) => {
            const shop = getShopById(order.shop);
            return (
              <div key={index} className="cart-items-title2 my-orders-order">
                <div className='order-shop__wrapper'>
                  <img className='parcel-epl__img' src={assets.parcel_epl} alt="Иконка посылки" />
                  <p className='order-txt'>{shop ? shop.name : "Магазин удален"}</p>
                </div>
                <p className="order-txt2">
                  {order.items.map((item, idx) => {
                    return idx === order.items.length - 1
                      ? `${item.name}`
                      : `${item.name}`;
                  })}
                </p>
                <p className='order-txt'>{order.amount}.00 ₽</p> {/*посмотреть какие данные приходят че то непонятно судя по всему цифра*/}
                <p className='order-txt'>Количество: {order.items.length}</p>
                <p className='order-txt2'>
                  {order.comment ? order.comment : "Отсутствует"}
                </p>
                <p className='order-txt'>{formatDate(order.date)}</p>
                <div className='order-wrapper'>
                  <p className='order-txt'>
                    <span>&#x25cf;</span>
                    <b className={getStatusClass(order.status)}>{order.status}</b>
                  </p>
                  <button className='order-button' onClick={() => fetchOrders(currentPage)}>Статус заказа</button>
                </div>
                {shop && (
                  <button className='comment-btn' onClick={() => handleOpenReviewPopup(order.shop, order._id)}>
                    <img className='comment-btn' src={assets.comment_btn} alt="" />
                  </button>
                )}
              </div>
            );
          })}
          <div className="cart-items__bottom"></div>
        </div>
        <PageSelector
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
        {isReviewPopupOpen && currentShopId && currentOrderId && (
          <ReviewPopup
            shopId={currentShopId}
            orderId={currentOrderId}
            onClose={handleCloseReviewPopup}
          />
        )}
      </div>
    </div>
  );
};

export default MyOrders;