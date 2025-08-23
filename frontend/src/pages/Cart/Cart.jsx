import { useContext, useState, useEffect } from 'react';
import './Cart.css';
import { StoreContext } from '../../components/Context/StoreContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItems, flowers_list, removeFromCart, getTotalCartAmount, getShopById } = useContext(StoreContext);
  const navigate = useNavigate();

  const [totalDeliveryPrice, setTotalDeliveryPrice] = useState(0);

  useEffect(() => {
    let totalDelivery = 0;
    const deliveryShops = new Set(); 

    flowers_list.forEach(item => {
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
    navigate('/order');
  };


  return (
    <div>
      <div className="cart">
        <div className="cart-items">
          <div className="cart-items-title">
            <p>Магазин</p>
            <p>Наименование</p>
            <p>Цена</p>
            <p>Количество</p>
            <p>Всего</p>
            <p>Удалить</p>
          </div>
          <br />
          <hr />
          {flowers_list.map((item) => {
            if (cartItems[item._id] > 0) {
              return (
                <div className="cart-items-title cart-items-item" key={item._id}>
                  <p>{getShopById(item.shop)?.name}</p>
                  <p>{item.name}</p>
                  <p>{item.price}₽</p>
                  <p>{cartItems[item._id]}</p>
                  <p>{item.price * cartItems[item._id]}₽</p>
                  <p onClick={() => removeFromCart(item._id)} className='cross'>x</p>
                </div>
              );
            }
          })}
        </div>
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2 className='cart-total-h2'>Информация о стоимости</h2>
          <div>
            <div className="cart-total-details">
              <p className='cart-total-inf'>Цена за товар</p>
              <p className='cart-total-inf'>{getTotalCartAmount()}₽</p>
            </div>
            <hr />
            {/*<div className="cart-total-details">
              <p className='cart-total-inf'>Стоимость доставки</p>
              <p className='cart-total-inf'>{totalDeliveryPrice}₽</p>
            </div>
            <hr />*/}
            <div className="cart-total-details">
              <p className='cart-total-inf'>Итого</p>
              <p className='cart-total-inf'>{getTotalCartAmount() /*+ totalDeliveryPrice*/}₽</p>
            </div>
          </div>
          <button onClick={handleOrder}>Перейти к оформлению заказа</button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
