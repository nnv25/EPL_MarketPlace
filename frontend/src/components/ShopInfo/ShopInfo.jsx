import "./ShopInfo.css";
import { Link } from "react-router-dom";
import { assets } from "../../assets/assets_flowers";

const ShopInfo = ({ shop, url }) => {
  if (!shop) return null; // на всякий случай

  const shopId = shop._id; // берём id из объекта магазина
  return (
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
        <div className="shop-adress__container">
          <div className="shop-icon__address">
            <img className="time-icon" src={assets.address_icon} alt="" />{" "}
            <p className="work-time-desc"> Адрес:</p>
          </div>
          <div className="shop-address__information">
            <p className="shop-information__desc">{shop.address}</p>
          </div>
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
  );
};

export default ShopInfo;
