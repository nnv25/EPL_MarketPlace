import { useContext, useEffect, useState } from "react";
import "./Shop.css";
import { StoreContext } from "../../components/Context/StoreContext";
import { useParams, Link } from "react-router-dom";
import JewerlyItem from "../../components/JewerlyItem/JewerlyItem";
import PageSelector from "../../components/PageSelector/PageSelector"; // Импортируйте новый компонент
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
          {shop.averageRating}
        </p>
      </div>
      <hr className="shop-info-divider" />
      <div className="shop-display">
        <div className="shop-display-top">
          <div className="shop-display-logo">
            <Link to={`/shop/${shopId}`}>
              <img
                className="shop-logo"
                src={`${url}/images/${shop.image}`}
                alt={shop.name}
              />
            </Link>
          </div>
          <div className="shop-center-information">
            <div className="shop-work__information">
              <div className="shop-icon__time">
                <img className="time-icon" src={assets.time} alt="" />{" "}
                <p className="work-time-desc"> Режим работы:</p>
              </div>
              <div>
                <p className="shop-information__desc">
                  {` Понедельник-Пятница: ${shop.work_time.weekdays},`}
                </p>
              </div>
              <div>
                <p className="shop-information__desc">
                  {` Суббота: ${shop.work_time.saturday},`}
                </p>
              </div>
              <div>
                <p className="shop-information__desc">
                  {` Воскресенье: ${shop.work_time.sunday}.`}
                </p>
              </div>
            </div>
            <div className="shop-payment__information">
              <div className="shop-icon__time">
                <img className="time-icon" src={assets.payment_icon} alt="" />{" "}
                <p className="work-time-desc"> Форма оплаты:</p>
              </div>
              <p className="shop-information">{shop.payment_form}</p>
            </div>
          </div>
          <div className="shop-left__information">
            <div className="shop-icon__address">
              <img className="time-icon" src={assets.address_icon} alt="" />{" "}
              <p className="work-time-desc"> Адрес:</p>
            </div>
            <div className="shop-address__information">
              <p className="shop-information__desc">{shop.address}</p>
            </div>
            <div className="shop-payment__information">
              <div className="shop-icon__time">
                <img className="time-icon" src={assets.delivery_icon} alt="" />{" "}
                <p className="work-time-desc"> Доставка:</p>
              </div>
              <p className="shop-information">
                {shop.delivery === true ? "Да" : "Нет"}
              </p>
            </div>
          </div>
        </div>
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
            <p>Нет доступных цветов в этом магазине.</p>
          )}
        </div>
      </div>
      <PageSelector
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      <div className="rating-window">
        <div>
          <p className="shop-raiting">
            <img src={assets.Star} alt="Рейтинг" className="star-logo-img" />
            {shop.averageRating} ({totalRatings})
          </p>
        </div>
        <h3 className="raiting-h3">Отзывы о магазине: "{shop.name}"</h3>
        {listRatings.map((item, index) => (
          <div key={index} className="rating rating-item-grid ">
            <div className=" ">
              <div className="rating-name flex">
                <p className="description">{item.userId.name}</p>
                <p className="rating-user-comment">
                  {formatDate(item.createdAt)} г.
                </p>
              </div>
              <div className="flex">
                <p className="rating-number">
                  <img
                    src={assets.Star}
                    alt="Рейтинг"
                    className="rating-star"
                  />
                </p>
                <p>{item.rating}</p>
                <p className="rating-user-comment">{item.comment}</p>
              </div>
            </div>
            <div className="">
              <div className="rating-name rating-shop-answer">
                <p>Ответ магазина:</p>
              </div>

              <div className="rating-shop-answer-content">
                <p>{item.storeComment}</p>
              </div>
            </div>
          </div>
        ))}
        <Link to={`/shop/${shopId}/rating/`}>
          <button className="shop-item-button rating-button-shop ">
            Все отзывы
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Shop;
