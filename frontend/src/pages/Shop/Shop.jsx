import { useContext, useEffect, useState } from "react";
import "./Shop.css";
import { StoreContext } from "../../components/Context/StoreContext";
import { useParams, Link } from "react-router-dom";
import JewerlyItem from "../../components/JewerlyItem/JewerlyItem";
import PageSelector from "../../components/PageSelector/PageSelector";
import ShopInfo from "../../components/ShopInfo/ShopInfo";
import { assets } from "../../assets/assets_flowers";

const Shop = () => {
  const {
    url,
    limited_shop_list,
    limited_flowers_list,
    fetchFlowersListWithPagination,
    fetchFlowersList,
    flowerPagination,
    listRatings,
    fetchRatingsList,
    totalRatings,
  } = useContext(StoreContext);
  const { shopId } = useParams();
  const { currentPage = 1, totalPages = 1 } = flowerPagination || {};
  const limit = 1;
  const shop = limited_shop_list.find((e) => e._id === shopId);
  if (!shop) {
    return <div>Магазин не найден</div>;
  }

  // Загружаем цветы при первом рендере и при изменении shopId или currentPage
  useEffect(() => {
    const fetchData = async () => {
      await fetchFlowersListWithPagination(shopId, currentPage);
      await fetchFlowersList(shopId);
      await fetchRatingsList(shopId, currentPage, limit);
    };

    fetchData();
  }, [shopId, currentPage, limit]);

  // Функция для изменения страницы
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      fetchFlowersListWithPagination(shopId, newPage);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  return (
    <div className="shop-container">
      <div className="shop-info">
        <p className="shop-name">{shop.name}</p>
        <p className="shop-rating">
          <img src={assets.daimond} alt="Рейтинг" className="star-logo-img" />
          {shop.averageRating}({totalRatings})
        </p>
      </div>
      <hr className="shop-info-divider" />
      <div className="shop-display">
        <ShopInfo shop={shop} url={url} />
        <div className="h3-item">
          <h3 className="item-h3">ТОВАРЫ</h3>
        </div>
        <hr className="shop-info-divider" />
        <div className="shop-display-list">
          {limited_flowers_list.length > 0 ? (
            limited_flowers_list.map((flower) => (
              <JewerlyItem key={flower._id} {...flower} />
            ))
          ) : (
            <p>Нет доступных товаров в этом магазине.</p>
          )}
        </div>
      </div>
      <PageSelector
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      <div className="h3-item">
        <h3 className="item-h3">ОТЗЫВЫ О МАГАЗИНЕ</h3>
      </div>
      <hr className="shop-info-divider" />
      <div className="rating-window">
        {listRatings.map((item, index) => (
          <div key={index} className="raiting-container">
            <div className="raiting-container__left">
              <div className="left-top">
                <div className="author-name">
                  <p className="description">{item.userId.name}</p>
                </div>
                <div className="comment-date">
                  <p className="user-comment__date">
                    {formatDate(item.createdAt)} г.
                  </p>
                </div>
              </div>
              <div className="comment-container">
                <div className="comment-block">
                  <p className="user-comment">{item.comment}</p>
                </div>
                <div className="raiting-block">
                  <p className="raiting-number"> Оценка: </p>
                  <img
                    src={assets.daimond}
                    alt="Рейтинг"
                    className="raiting-star"
                  />
                  <p className="raiting-number__left">{item.rating}</p>
                </div>
              </div>
            </div>
            <div className="raiting-container__right">
              <div className="right-top">
                <div className="author-name">
                  <p className="description">Ответ магазина</p>
                </div>
                <div className="comment-date">
                  <p className="user-comment__date">{item.storeComment}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Link to={`/shop/${shopId}/rating/`}>
        <button className="shop-item-button rating-button-shop ">
          Все отзывы
        </button>
      </Link>
    </div>
  );
};

export default Shop;
