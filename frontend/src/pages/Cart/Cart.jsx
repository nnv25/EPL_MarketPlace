import { useContext, useState, useEffect } from "react";
import "./Cart.css";
import { StoreContext } from "../../components/Context/StoreContext";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets_flowers";

const Cart = () => {
  const {
    cartItems,
    flowers_list,
    removeFromCart,
    getTotalCartAmount,
    getShopById,
  } = useContext(StoreContext);
  const navigate = useNavigate();

  const [totalDeliveryPrice, setTotalDeliveryPrice] = useState(0);

  useEffect(() => {
    let totalDelivery = 0;
    const deliveryShops = new Set();

    flowers_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        const shop = getShopById(item.shop);
        /*if (shop.delivery && !deliveryShops.has(shop._id)) { 
          deliveryShops.add(shop._id); 
          totalDelivery += shop.delivery_price;
        }*/
      }
    });

    setTotalDeliveryPrice(totalDelivery);
  }, [cartItems, flowers_list, getShopById]);

  const handleOrder = () => {
    navigate("/order");
  };

  return (
    <div>
      <div className="cart">
        <div className="cart-title">
          <h2 className="cart-h2">КОРЗИНА</h2>
          <hr className="shop-info-divider" />
        </div>
        <div className="cart-items">
          <div className="cart-items-title">
            <div className="cart-item-wrapper">
              <p className="cart-items-name">Магазин</p>
            </div>
            <div className="cart-item-wrapper">
              <p className="cart-items-name">Наименование</p>
            </div>
            <div className="cart-item-wrapper">
              <p className="cart-items-name">Цена</p>
            </div>
            <div className="cart-item-wrapper">
              <p className="cart-items-name">Количество</p>
            </div>
            <div className="cart-item-wrapper">
              <p className="cart-items-name">Всего</p>
            </div>
            <div className="cart-item-wrapper">
              <p className="cart-items-name">Удалить</p>
            </div>
          </div>
          <br />
          {flowers_list.map((item) => {
            if (cartItems[item._id] > 0) {
              return (
                <div
                  className="cart-items-title cart-items-item"
                  key={item._id}
                >
                  <p className="cart-items-txt">
                    {getShopById(item.shop)?.name}
                  </p>
                  <p className="cart-items-txt">{item.name}</p>
                  <p className="cart-items-txt">
                    {item.price.toLocaleString("ru-RU", {
                      minimumFractionDigits: 2,
                    })}{" "}
                    ₽
                  </p>
                  <p className="cart-items-txt">{cartItems[item._id]}</p>
                  <p className="cart-items-txt">
                    {(item.price * cartItems[item._id]).toLocaleString(
                      "ru-RU",
                      { minimumFractionDigits: 2 }
                    )}{" "}
                    ₽
                  </p>
                  <p onClick={() => removeFromCart(item._id)} className="cross">
                    <img
                      className="cart-items-trash"
                      src={assets.trash_icon}
                      alt=""
                    />
                  </p>
                </div>
              );
            }
          })}
          <div className="cart-items__bottom"></div>
        </div>
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2 className="cart-total-h2">Информация о стоимости</h2>
          <hr className="shop-info-divider2" />
          <div>
            <div className="cart-total-details">
              <p className="cart-total-inf">Цена за товар</p>
              <p className="cart-total-inf">
                {getTotalCartAmount().toLocaleString("ru-RU", {
                  minimumFractionDigits: 2,
                })}
                ₽
              </p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p className="cart-total-inf">Итого</p>
              <p className="cart-total-inf">
                {getTotalCartAmount().toLocaleString("ru-RU", {
                  minimumFractionDigits: 2,
                })}
                ₽
              </p>
            </div>
          </div>
          <button onClick={handleOrder}>Перейти к оформлению</button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
