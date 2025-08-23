import { useContext, useEffect, useState } from "react";
import "./ShopItem.css";
import { Link } from 'react-router-dom';
import { StoreContext } from "../Context/StoreContext";
import { assets } from "../../assets/assets_flowers";

const ShopItem = ({ id, name, image, delivery,averageRating }) => {
  const { url } = useContext(StoreContext);
  const [shopStatus, setShopStatus] = useState('information missing');
  useEffect(() => {

    const fetchShopStatus = async () => {
      try {
        const response = await fetch(`${url}/api/shop/status/${id}`);
        const data = await response.json();

        if (response.ok) {
          // Проверка на статус магазина, если он закрыт
          if (data.message === "Магазин открыт") {
            setShopStatus("open");
          } else if (data.message === "Магазин закрыт") {
            setShopStatus("closed");
          } else if (data.message.includes("выходной")) { // Проверка на выходной
            setShopStatus("holiday");
          }
        } else {
          console.error('Ошибка при получении статуса магазина:', data.message);
        }
      } catch (error) {
        console.error('Ошибка при получении статуса магазина:', error);
      }
    };

    fetchShopStatus();
  }, [id, url]);

  return (
    <Link to={`/shop/${id}`}>
    <div className="shop-item">
      <div className="shop-item-img-container">
        <img className="shop-item-image" src={`${url}/images/${image}`} alt="" />
      </div>
      <div className="shop-item-info">
        <div className="shop-item-name-rating">
          <p className="shop-name">{name}</p>
        </div>
        <p className="shop-item-status" style={{ color: shopStatus === "open" ? "green" : shopStatus === "holiday" ? "orange" : "red" }}>
          {shopStatus === "open" 
            ? "Открыто" 
            : shopStatus === "holiday" 
              ? "Выходной" 
              : "Закрыто"
          }
        </p>
        <p className="shop-item-raiting">
          <img src={assets.daimond} alt="Рейтинг" className="star_logo" />
          {averageRating}
        </p>
        <p className="shop-item-delivery">
          Доставка:{delivery === true ? " Да" : " Нет"}
        </p>
      </div>
    </div>
    </Link>
  );
};

export default ShopItem;