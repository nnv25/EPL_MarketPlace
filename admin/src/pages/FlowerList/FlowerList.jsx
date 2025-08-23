import { useEffect, useState, useContext } from 'react';
import './FlowerList.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ShopContext } from '../../components/Context/ShopContext';
import PageSelector from '../../components/PageSelector/PageSelector';
import { Link } from 'react-router-dom';

const FlowerList = () => {
  const { selectedShop, shops, url } = useContext(ShopContext);
  const [list, setList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const fetchList = async (shopId, page = 1) => {
    try {
      const response = await axios.get(`${url}/api/flower/limitlist/${shopId}?page=${page}&limit=10`);
      if (response.data.success) {
        setList(response.data.data);
        setTotalPages(response.data.pagination.totalPages); // Обновляем общее количество страниц
      } else {
        toast.error("Ошибка при загрузке цветов: " + response.data.message);
      }
    } catch (error) {
      toast.error("Ошибка при загрузке цветов");
      console.error("Ошибка при загрузке цветов:", error);
    }
  };

  useEffect(() => {
    if (selectedShop) {
      fetchList(selectedShop, currentPage);
    }
  }, [selectedShop, currentPage]);

  const selectedShopName = shops.find(shop => shop._id === selectedShop)?.name;

  const removeFlowers = async (flowerId, shopId) => {
    try {
      const response = await axios.delete(`${url}/api/flower/flowers/${flowerId}/${shopId}`);
      if (response.data.success) {
        await fetchList(shopId, currentPage); // Обновляем список цветов после удаления
        toast.success(response.data.message);
      } else {
        toast.error('Ошибка при удалении');
      }
    } catch (error) {
      toast.error('Ошибка при удалении');
      console.error("Ошибка при удалении цветка:", error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchList(selectedShop, page); // Запрос на получение цветов для новой страницы
  };

  return (
    <div className='list add flex-col'>
      <p>Список всех товаров</p>
      <div className="list-table">
        <div className="list-table-format2 title2">
          <b>Фотография</b>
          <b>Название</b>
          <b>Описание</b>
          <b>Магазин</b>
          <b>Цена</b>
          <b>Удалить</b>
          <b>Изменить</b>
        </div>
        {list.map((item, index) => (
          <div key={index} className="list-table-format2">
            <div className="images-container">
              {item.images.map((image, imgIndex) => (
                <img key={imgIndex} src={`${url}/flower-images/${image}`} alt="" />
              ))}
            </div>
            <p className="description">{item.name}</p>
            <p className="description">{item.description}</p>
            <p>{selectedShopName}</p>
            <p>{item.price}Р</p>
            <p onClick={() => removeFlowers(item._id, selectedShop)} className='cursor'>X</p>
            <Link to={item._id}>
            <button>Изменить</button>
            </Link>
          </div>
        ))}
      </div>
      <PageSelector 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default FlowerList;