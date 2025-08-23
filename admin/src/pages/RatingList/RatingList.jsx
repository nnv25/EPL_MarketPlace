import { useEffect, useState, useContext } from 'react';
import './RatingList.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ShopContext } from '../../components/Context/ShopContext';
import ReviewPopup from '../../components/ReviewPopup/ReviewPopup';
import PageSelector from '../../components/PageSelector/PageSelector';

const RatingList = () => {
  const { selectedShop, shops, url } = useContext(ShopContext);
  const [list, setList] = useState([]);
  const [isReviewPopupOpen, setReviewPopupOpen] = useState(false); 
  const [currentShopId, setCurrentShopId] = useState(null); 
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [currentRatingId, setCurrentRatingId] = useState(null); 
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRatings, setTotalRatings] = useState(0);
  
  const fetchList = async (shopId, page = 1) => {
    try {
      const response = await axios.get(`${url}/api/rating/limitList/${shopId}?page=${page}&limit=10`);
      if (response.data.success) {
        setList(response.data.data);
        setTotalPages(response.data.pagination.totalPages); // Обновляем общее количество страниц
        setTotalRatings(response.data.pagination.totalRatings);
      } else {
        toast.error("Ошибка при загрузке цветов: " + response.data.message);
      }
    } catch (error) {
      toast.error("Ошибка при загрузке цветов");
      console.error("Ошибка при загрузке цветов:", error);
    }
  };

  const [averageRating, setAverageRating] = useState(0);
  const fetchAverageRating = async (shopId) => {
    try {
      const response = await axios.get(`${url}/api/rating/average/${shopId}`);
      if (response.data.success) {
        setAverageRating(response.data.averageRating);
      } else {
        toast.error("Сейчас у вас нет отзывов.");
      }
    } catch (error) {
      toast.error("Загрузка оценок выдала ошибку");
      console.error("Загрузка оценок выдала ошибку:", error);
    }
  };

  useEffect(() => {
      fetchList(selectedShop, currentPage);
      fetchAverageRating(selectedShop);
  }, [selectedShop, currentPage]);

  const handleOpenReviewPopup = (shopId, orderId, _id) => {
    setCurrentShopId(shopId); 
    setCurrentOrderId(orderId);
    setCurrentRatingId(_id);
    setReviewPopupOpen(true);
  };

  const handleCloseReviewPopup = () => {
    setReviewPopupOpen(false);
    setCurrentShopId(null);
    setCurrentRatingId(null);
    setCurrentOrderId(null); 
    fetchList(selectedShop, currentPage);
  };

  const handlePageChange = (page) => {
    if (selectedShop) {
      setCurrentPage(page);
      fetchList(selectedShop, page); // Запрос на получение цветов для новой страницы
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
  
  return (
    <div className='list add flex-col'>
      <h4>Список всех отзывов</h4>
      <p>Количество отзывов: {totalRatings}</p>
      <p>Ваш рейтинг: {averageRating}</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Имя</b>
          <b>Оценка</b>
          <b>Отзыв</b>
          <b>Дата</b>
          <b>Ответ</b>
          <b>Ответить</b>
        </div>
        {list.map((item, index) => (
          <div key={index} className="list-table-format">
            <p className="description">{item.userId.name}</p>
            <p className="description">{item.rating}</p>
            <p>{item.comment}</p>
            <p>{formatDate(item.createdAt)}</p>
            <p>{item.storeComment}</p>
            <button onClick={() => handleOpenReviewPopup(item.shopId, item.orderId, item._id)}>Ответить</button>
          </div>
        ))}
      </div>
      <PageSelector 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      {isReviewPopupOpen && currentShopId && currentOrderId && currentRatingId && ( 
        <ReviewPopup 
          shopId={currentShopId}
          orderId={currentOrderId}
          ratingId={currentRatingId} 
          onClose={handleCloseReviewPopup} 
        />
      )}
    </div>
  );
};

export default RatingList;