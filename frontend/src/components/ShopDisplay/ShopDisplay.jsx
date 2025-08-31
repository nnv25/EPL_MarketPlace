import { useContext, useEffect, useState } from "react";
import "./ShopDisplay.css";
import { StoreContext } from "../Context/StoreContext";
import ShopItem from "../ShopItem/ShopItem";
import PageSelector from "../PageSelector/PageSelector";

const ShopDisplay = () => {
  const { limited_shop_list, fetchShopListWithPagination, pagination } =
    useContext(StoreContext); // Получаем данные и функцию из контекста
  const [currentPage, setCurrentPage] = useState(1); // Состояние для текущей страницы

  // Функция для загрузки данных при изменении страницы
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchShopListWithPagination(newPage); // Вызываем функцию для получения данных с новой страницы
  };

  // При первой загрузке компонента загружаем магазины для первой страницы
  useEffect(() => {
    fetchShopListWithPagination(currentPage);
  }, [currentPage]);

  return (
    <div id="stores" className="shop-display">
      <h2>МАГАЗИНЫ</h2>
      <hr className="shop-info-divider" />
      <div className="shop-display-list">
        {limited_shop_list.map((item, index) => (
          <ShopItem
            key={index}
            id={item._id}
            name={item.name}
            work_time={item.work_time}
            address={item.address}
            payment_form={item.payment_form}
            image={item.image}
            delivery={item.delivery}
            averageRating={item.averageRating}
          />
        ))}
      </div>
      <PageSelector
        currentPage={currentPage}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default ShopDisplay;
