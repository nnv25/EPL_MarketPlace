import './UpdateShop.css';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { ShopContext } from '../../components/Context/ShopContext';
import { toast } from 'react-toastify';
import InputMask from 'react-input-mask';
import { assets } from '../../assets/assets';

const UpdateShop = () => {
  const { url, selectedShop, shops } = useContext(ShopContext);
  const [image, setImage] = useState(null);
  const [shopData, setShopData] = useState({
    name: '',
    work_time: { weekdays: '', saturday: '', sunday: '' },
    address: '',
    phone: '',
    delivery: false,
    /*delivery_price: '',*/
    payment_form: [],
    image: ''
  });

  useEffect(() => {
    if (selectedShop) {
      const shop = shops.find(shop => shop._id === selectedShop);
      if (shop) {
        setShopData({
          name: shop.name || '',
          work_time: shop.work_time || { weekdays: '', saturday: '', sunday: '' },
          address: shop.address || '',
          phone: shop.phone || '',
          delivery: shop.delivery || false,
          /*delivery_price: shop.delivery_price || '',*/
          payment_form: shop.payment_form || [],
          image: shop.image || ''
        });
      }
    }
  }, [selectedShop, shops]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setShopData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleWorkTimeChange = (e) => {
    const { name, value } = e.target;
    setShopData(prevData => ({
      ...prevData,
      work_time: {
        ...prevData.work_time,
        [name]: value,
      },
    }));
  };

  const handleFileChange = (e) => {
    setShopData(prevData => ({
      ...prevData,
      image: e.target.files[0]
    }));
  };

  const handlePaymentChange = (e) => {
  const { name, checked } = e.target;
  setShopData(prev => {
    let updated = [...prev.payment_form];
    if (checked) {
      updated.push(name);
    } else {
      updated = updated.filter(item => item !== name);
    }
    return { ...prev, payment_form: updated };
  });
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    const workTimeRegex = /^(\d{2}:\d{2}-\d{2}:\d{2}|выходной)$/;

    // Проверка обязательных полей
    if (!shopData.name.trim()) {
      toast.error('Название магазина не может быть пустым');
      return;
    }

    if (
      !shopData.work_time.weekdays.trim() ||
      !shopData.work_time.saturday.trim() ||
      !shopData.work_time.sunday.trim()
    ) {
      toast.error('Часы работы не могут быть пустыми');
      return;
    }

    if (!shopData.address.trim()) {
      toast.error('Адрес не может быть пустым');
      return;
    }

    if (!shopData.payment_form || shopData.payment_form.length === 0) {
      toast.error('Форма оплаты не может быть пустой');
      return;
    }

    const invalidWorkTime = Object.values(shopData.work_time).some(
      (time) => !workTimeRegex.test(time)
    );
    if (invalidWorkTime) {
      toast.error(
        "Неверный формат времени. Используйте следующий формат '10:00-19:00' или 'выходной'"
      );
      return;
    }

    // Отправка данных на сервер
    try {
      const formData = new FormData();
      formData.append('id', selectedShop);

      // Часы работы
      formData.append('work_time.weekdays', shopData.work_time.weekdays);
      formData.append('work_time.saturday', shopData.work_time.saturday);
      formData.append('work_time.sunday', shopData.work_time.sunday);

      // Остальные поля
      formData.append('name', shopData.name);
      formData.append('address', shopData.address);
      formData.append('phone', shopData.phone);
      formData.append('delivery', shopData.delivery.toString());

      // Форма оплаты (каждый элемент отдельно)
      shopData.payment_form.forEach((method) => {
        formData.append('payment_form', method);
      });

      // Логотип
      if (shopData.image) {
        formData.append('image', shopData.image);
      }

      const response = await axios.put(`${url}/api/shop/update`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        toast.success('Магазин успешно обновлен');
      } else {
        toast.error('Ошибка при обновлении магазина');
      }
    } catch (error) {
      console.error('Ошибка при обновлении магазина:', error);
      toast.error('Произошла ошибка при обновлении магазина');
    }
  };

  return (
    <div className="shop-details">
      <div className="h2-item">
        <h3 className="item-h2">РЕДАКТИРОВАНИЕ МАГАЗИНА</h3>
      </div>
      <hr className="shop-info-divider" />
      {selectedShop ? (
        <form onSubmit={handleSubmit} className="shop-details-form">
          <div className="add-shop-name">
            <label className='shop-update-text'>1.Название магазина</label>
            <input
              type="text"
              name="name"
              value={shopData.name}
              onChange={handleChange}
              readOnly
              className='addshop-input'
            />
            <p className='details-text'>Данный пункт может быть отредактирован только при обращении в службу поддержки приложения</p>
          </div>
          <div className="add-shop-worktime">
            <label className='shop-title'>2.Часы работы</label>
            <div className='shop-worktime'>
              <div className='addshop-container'>
                <div className='shop-time-container'>
                  <p className='shop-title-time'>Пн-пт</p>
                </div>
                <input
                  id="weekdays"
                  name="weekdays"
                  value={shopData.work_time.weekdays}
                  onChange={handleWorkTimeChange}
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
                  name="saturday"
                  value={shopData.work_time.saturday}
                  onChange={handleWorkTimeChange}
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
                  id="sunday"
                  name="sunday"
                  value={shopData.work_time.sunday}
                  onChange={handleWorkTimeChange}
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
              value={shopData.address}
              onChange={handleChange}
              placeholder="Введите адрес магазина"
              required
              className='addshop-input'
            />
          </div>
          <div className="add-shop-phone">
            <p className='shop-title'>Телефон</p>
            <InputMask
              type="tel"
              name="phone"
              value={shopData.phone}
              onChange={handleChange}
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
              value={shopData.delivery}
              onChange={handleChange}
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
                  checked={shopData.payment_form.includes("Наличные")}
                  onChange={handlePaymentChange}
                />
                Наличные
              </label>
              <label className='payment-form-desc'>
                <input
                  className='payment-form'
                  type="checkbox"
                  name="Банковской картой"
                  checked={shopData.payment_form.includes("Банковской картой")}
                  onChange={handlePaymentChange}
                />
                Банковской картой
              </label>
              <label className='payment-form-desc'>
                <input
                  className='payment-form'
                  type="checkbox"
                  name="Онлайн перевод"
                  checked={shopData.payment_form.includes("Онлайн перевод")}
                  onChange={handlePaymentChange}
                />
                Онлайн перевод
              </label>
            </div>
          </div>
         <div className="add-img-upload flex-col">
          <p className='shop-title'>Загрузить логотип магазина</p>
          <label htmlFor="image">
            <img src={image ? URL.createObjectURL(image) : assets.shop_logo_load} alt="Upload area" />
          </label>
          <input 
            type="file" 
            id="image" 
            onChange={(e) => setImage(e.target.files[0])} 
            required 
            hidden
          />
        </div>
          <button type="submit" className="add-btn">Сохранить изменения</button>
          <p className='details-text'>Для того, чтобы изменения вступили в силу, после их сохранения и отобразились на текущей странице, необходимо перезагрузить страницу</p>
        </form>
      ) : (
        <p>Выберите магазин из списка</p>
      )}
    </div>
  );
};

export default UpdateShop;