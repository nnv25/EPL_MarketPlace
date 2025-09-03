import { useState } from 'react';
import axios from 'axios';
import { assets } from '../../assets/assets';
import './AddShop.css';
import { toast } from 'react-toastify';
import InputMask from 'react-input-mask';

const AddShop = () => {
  const [delivery, setDelivery] = useState(false);
  /*const [deliveryPrice, setDeliveryPrice] = useState('');*/
  const [paymentForms, setPaymentForms] = useState({
    'Наличные': false,
    'Банковской картой': false,
    'Онлайн перевод': false,
  });
  const [image, setImage] = useState(null);
  const [shopName, setShopName] = useState('');
  const [workTimeWeekdays, setWorkTimeWeekdays] = useState('');
  const [workTimeSaturday, setWorkTimeSaturday] = useState('');
  const [workTimeSunday, setWorkTimeSunday] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  const handlePaymentFormChange = (event) => {
    const { name, checked } = event.target;
    setPaymentForms((prevForms) => ({
      ...prevForms,
      [name]: checked,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const workTimeRegex = /^(\d{2}:\d{2}-\d{2}:\d{2}|выходной)$/;

    if (
      !workTimeRegex.test(workTimeWeekdays) ||
      !workTimeRegex.test(workTimeSaturday) ||
      !workTimeRegex.test(workTimeSunday)
    ) {
      toast.error("Неверный формат времени. Используйте '10:00-19:00' или 'выходной'");
      return;
    }

    const formData = new FormData();
    formData.append('name', shopName);
    formData.append('image', image);
    formData.append('work_time[weekdays]', workTimeWeekdays);
    formData.append('work_time[saturday]', workTimeSaturday);
    formData.append('work_time[sunday]', workTimeSunday);
    formData.append('address', address);
    formData.append('phone', phone);
    formData.append('delivery', delivery);
    formData.append('payment_form', Object.keys(paymentForms).filter(key => paymentForms[key]).join(', '));

    /*if (delivery) {
      formData.append('delivery_price', deliveryPrice);
    }*/

    try {
      const response = await axios.post('http://localhost:4000/api/shop/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message || "Error");
      }
    } catch (error) {
      console.error('Ошибка при добавлении магазина:', error);
      toast.error('Произошла ошибка при добавлении магазина');
    }
  };

  return (
    <div className="add">
      <div className="h2-item">
        <h3 className="item-h2">ДОБАВИТЬ МАГАЗИН</h3>
      </div>
      <hr className="shop-info-divider" />
      <form className="flex-col" onSubmit={handleSubmit}>
        {/*<div className="add-img-upload flex-col">
          <p className='shop-title'>Загрузить логотип магазина</p>
          <label htmlFor="image">
            <img src={image ? URL.createObjectURL(image) : assets.upload_area} alt="Upload area" />
          </label>
          <input 
            type="file" 
            id="image" 
            onChange={(e) => setImage(e.target.files[0])} 
            required 
            hidden
          />
        </div>*/}
        <div className="add-shop-name">
          <p className='shop-title'>Название магазина</p>
          <input
            type="text"
            name="name"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            placeholder="Введите название магазина"
            required
            className='addshop-input'
          />
        </div>
        <div className="add-shop-worktime">
          <label className='shop-title' htmlFor="weekdays">Часы работы:</label>
          <div className='shop-worktime'>
            <div className='addshop-container'>
              <div className='shop-time-container'>
                <p className='shop-title-time'>Пн-пт</p>
              </div>
              <input
                id="weekdays"
                value={workTimeWeekdays}
                onChange={(e) => setWorkTimeWeekdays(e.target.value)}
                placeholder="Введите часы работы магазина в будни"
                required
                className='addshop-input'
              />
            </div>
            <div className='addshop-container'>
              <div className='shop-time-container'>
                <p className='shop-title-time'>Суб</p>
              </div>
              <input
                className='addshop-input'
                id="saturday"
                value={workTimeSaturday}
                onChange={(e) => setWorkTimeSaturday(e.target.value)}
                placeholder="Введите часы работы магазина в субботу"
                required
              />
            </div>
            <div className='addshop-container'>
              <div className='shop-time-container'>
                <p className='shop-title-time'>Вск</p>
              </div>
              <input
                className='addshop-input'
                id="saturday"
                value={workTimeSaturday}
                onChange={(e) => setWorkTimeSaturday(e.target.value)}
                placeholder="Введите часы работы магазина в воскресенье"
                required
              />
            </div>
          </div>
        </div>
        <div className="add-shop-address">
          <p className='shop-title'>Адрес</p>
          <input
            type="text"
            name="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Введите адрес магазина"
            required
            className='addshop-input'
          />
        </div>
        <div className="add-shop-address">
          <p className='shop-title'>Страна</p>
          <input
            type="text"
            name="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Выберите страну" /*нужно добавить страну*/
            required
            className='addshop-input'
          />
        </div>
        <div className="add-shop-phone">
          <p className='shop-title'>Телефон</p>
          <InputMask
            type="tel"
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            mask="+7(999)999-99-99"
            placeholder="Введите телефон магазина"
            required
            className='addshop-input'
          />
        </div>
        <div className="add-shop-delivery">
          <p className='shop-title'>Доставка:</p>
          <select
            name="delivery"
            value={delivery}
            onChange={(e) => setDelivery(e.target.value === 'true')}
          >
            <option value="false">Нет</option>
            <option value="true">Да</option>
          </select>
          {/*delivery && (
            <div className="delivery-price flex-col">
              <p className='shop-title'>Цена доставки</p>
              <input
                type="number"
                value={deliveryPrice}
                onChange={(e) => setDeliveryPrice(e.target.value)}
                placeholder="Введите цену доставки"
                min="0"
                required={delivery}
              />
            </div>
          )*/}
        </div>
        <div className="add-shop-payment-form">
          <p className='shop-title'>Форма оплаты:</p>
          <div className='payment-select'>
            <label className='payment-form-desc'>
            <input
              className='payment-form'
              type="checkbox"
              name="Наличные"
              checked={paymentForms['Наличные']}
              onChange={handlePaymentFormChange}
            />
            Наличные
          </label>
          <label className='payment-form-desc'>
            <input
              className='payment-form'
              type="checkbox"
              name="Банковской картой"
              checked={paymentForms['Банковской картой']}
              onChange={handlePaymentFormChange}
            />
            Банковской картой
          </label>
          <label className='payment-form-desc'>
            <input
              className='payment-form'
              type="checkbox"
              name="Онлайн перевод"
              checked={paymentForms['Онлайн перевод']}
              onChange={handlePaymentFormChange}
            />
            Онлайн перевод
          </label>
          </div>
        </div>
        <button type="submit" className="add-btn">Добавить магазин</button>
      </form>
    </div>
  );
};

export default AddShop;