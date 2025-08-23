import { useContext, useState, useEffect } from 'react';
import './PlaceOrder.css'
import InputMask from "react-input-mask";
import { StoreContext } from '../../components/Context/StoreContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {

  const {getTotalCartAmount,token,flowers_list,cartItems,url, getShopById, setShowLogin, clearCart } = useContext(StoreContext);
  const [data, setData] = useState({
    firstName:"",
    address:"",
    phone:"",
    comment:"",
  })

  const navigate=useNavigate()

  // Состояние для хранения выбранного способа оплаты
  const [selectedMethod, setSelectedMethod] = useState('наличными');
  // Состояние для способа доставки
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState('самовывоз');

  /*useEffect(() => {
    let totalDelivery = 0;
    const deliveryShops = new Set(); // Используем Set для хранения магазинов с доставкой

    flowers_list.forEach(item => {
      if (cartItems[item._id] > 0) {
        const shop = getShopById(item.shop); // Получаем информацию о магазине
        /*if (shop.delivery && !deliveryShops.has(shop._id)) { // Проверяем, есть ли доставка и не добавляли ли магазин раньше
          deliveryShops.add(shop._id); // Добавляем магазин в Set
          totalDelivery += shop.delivery_price; // Добавляем стоимость доставки один раз для магазина
        }*/
      /*}
    });

    setTotalDeliveryPrice(totalDelivery);
  }, [cartItems, flowers_list, getShopById]);*/

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data=>({...data,[name]:value}));
  }

  // Функция для обработки изменений в выпадающем списке
  const handleChange = (event) => {
    setSelectedMethod(event.target.value);
  };

  const placeOrder = async(event) => {
    event.preventDefault();

    // Находим первый товар в корзине, чтобы получить его магазин
    let shopId;
    flowers_list.map((item) => {
      if (cartItems[item._id] > 0) {
        shopId = item.shop; // Получаем shopId из товара
        return; // Прекращаем цикл, как только нашли магазин
      }
    });

    let orderItems = [];
    flowers_list.map((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = item;
        itemInfo["quantity"] = cartItems[item._id];
        orderItems.push(itemInfo);
      }
    });

    let orderData = {
      userId: token,
      shopId,  // Добавляем shopId в заказ
      address: data,
      items: orderItems,
      amount: getTotalCartAmount(),
      payment: selectedMethod,
      comment: data.comment,
      deliveryOption: selectedDeliveryOption,
    };

    try {
      const response = await axios.post(url + "/api/order/place", orderData, { headers: { token } });
      clearCart();
      navigate('/myorders');
    } catch (error) {
      console.error("Ошибка при размещении заказа", error);
    }
  };

  useEffect(()=>{
    if(!token){
      setShowLogin(true)
      navigate('/cart')
      return
    }
    if(getTotalCartAmount()===0){
      alert("Для оформления заказа Вам необходимо добавить товары")
      navigate('/cart')
    }
  },[token, getTotalCartAmount, navigate, setShowLogin])


  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p>Информация о заказе</p>
        <div className="multi-fields">
          <input
            required
            name="firstName"
            onChange={onChangeHandler}
            value={data.firstName}
            type="text"
            placeholder="Имя"
          />
        </div>
        <input
          required
          name="address"
          onChange={onChangeHandler}
          value={data.address}
          type="text"
          placeholder="Адрес"
        />
        <InputMask
          name="phone"
          onChange={onChangeHandler}
          value={data.phone}
          mask="+7(999)999-99-99"
          placeholder="Номер телефона"
          required
        />
        <textarea 
          name="comment" 
          id=""
          onChange={onChangeHandler}
          value={data.comment}
          placeholder='Комментарий к заказу'
          maxLength={100}
          >
        </textarea>
        <div className='delivery-information'>
          <label className="delivery-information" htmlFor="delivery-method">
            Выберите способ получения:
          </label>
          <select
            id="delivery-method"
            value={selectedDeliveryOption}
            onChange={(e) => setSelectedDeliveryOption(e.target.value)}
          >
            <option value="самовывоз">Самовывоз</option>
            <option value="доставка">Доставка</option>
          </select>
          <p className="delivery-information">
            Выбранный способ получения: {selectedDeliveryOption}.
          </p>
          {selectedDeliveryOption === "доставка" && (
            <p className="delivery-warning">
              Необходимо уточнить стоимость доставки у магазина.
            </p>
          )}
        </div>
        <div>
          <label className="payment-information" htmlFor="payment-method">
            Выберите способ оплаты:
          </label>
          <select
            id="payment-method"
            value={selectedMethod}
            onChange={handleChange}
          >
            <option value="наличными">Наличными</option>
            <option value="переводом">Переводом</option>
            <option value="банковской картой">Банковской картой</option>
          </select>
          <p className="payment-information">
            Выбранный способ оплаты: {selectedMethod}
          </p>
        </div>
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2 className='cart-total-h2'>Информация о стоимости</h2>
          <div>
            <div className="cart-total-details">
              <p className='place-order-inf'>Цена за товар</p>
              <p className='place-order-inf'>{getTotalCartAmount()}₽</p>
            </div>
            <hr />
            {/*<div className="cart-total-details">
              <p className='place-order-inf'>Стоимость доставки</p>
              <p className='place-order-inf'>{totalDeliveryPrice}₽</p>
            </div>
            <hr />*/}
            <div className="cart-total-details">
              <p className='place-order-inf'>Итого</p>
              <p className='place-order-inf'>{getTotalCartAmount()}₽</p>
            </div>
          </div>
          <button type="submit" className='order_button'>ЗАКАЗАТЬ</button>
        </div>
      </div>
    </form>
  );
}

export default PlaceOrder